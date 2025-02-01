import os
import discord


class MyClient(discord.Client):
    async def on_ready(self):
        print(f"[discord.py] Logged on as {self.user}!")


intents = discord.Intents(int(os.getenv("INTENTS", "0")))

client = MyClient(intents=intents)

client.run(os.getenv("TOKEN", ""))
