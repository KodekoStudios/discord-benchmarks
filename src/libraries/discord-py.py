import os

from discord import Message
import discord
import asyncio
import psutil
import json


def get_memory_and_cpu_usage():  # type: ignore
    process = psutil.Process()
    memory_info = process.memory_info()
    cpu_times = process.cpu_times()

    return {
        "heapUsed": memory_info.rss,  # RSS es la memoria residente (similar a heapUsed en Node.js)
        "rss": memory_info.rss,  # Memoria residente
        "heapTotal": memory_info.vms,  # Memoria virtual (similar a heapTotal en Node.js)
        "cpuUser": cpu_times.user,  # Tiempo de CPU en modo usuario
        "cpuSystem": cpu_times.system,  # Tiempo de CPU en modo sistema
    }  # type: ignore


# Función para enviar métricas cada 5 segundos
async def send_memory_usage():
    while True:
        usage = get_memory_and_cpu_usage()  # type: ignore
        print(json.dumps(usage))  # Imprimir las métricas en formato JSON
        await asyncio.sleep(5)


class MyClient(discord.Client):
    async def on_ready(self):
        print(f"[discord.py] Logged on as {self.user}!")
        client.loop.create_task(send_memory_usage())

    async def on_message(self, message: Message):
        print(f"[discord.py] Message from {message.author}: {message.content}")
        print(f"[discord.py] Message sent: {message.created_at}")


intents = discord.Intents(int(os.getenv("INTENTS", "0")))

client = MyClient(intents=intents)

client.run(os.getenv("TOKEN", ""))
