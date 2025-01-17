##末影祭坛
execute as @a[scores={magicpoint=20..}] at @s if block ~~-0.1~ dec:end_altar [] run tag @s add tp
scoreboard players remove @a[tag=tp] magicpoint 20
execute as @a[tag=tp] at @s run spreadplayers ~ ~ 1 64 @s
tag @a[tag=tp] remove tp

##溪流矿
execute at @e[type=lightning_bolt] run fill ~-1 ~-1 ~-1 ~1 ~1 ~1 dec:stream_ore [] replace iron_ore []

##流动块一级
execute as @a[scores={magicpoint=..20}] at @s if block ~ ~-0.1 ~ dec:flowing_block ["dec:energy"=1] run tag @s add flowing_block_1
execute as @a[scores={magicpoint=..20}] at @s if block ~ ~-0.1 ~ dec:flowing_block ["dec:energy"=1] run setblock ~~-0.1 ~ dec:flowing_block ["dec:energy"=0]
scoreboard players add @a[tag=flowing_block_1] magicpoint 10
execute at @a[tag=flowing_block_1] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_1] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_1] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_1] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_1] run particle dec:white_star_particle ~~~
tag @a remove flowing_block_1

##流动块二级
execute as @a[scores={magicpoint=..30}] at @s if block ~ ~-0.1 ~ dec:flowing_block ["dec:energy"=2] run tag @s add flowing_block_2
execute as @a[scores={magicpoint=..30}] at @s if block ~ ~-0.1 ~ dec:flowing_block ["dec:energy"=2] run setblock ~~-0.1 ~ dec:flowing_block ["dec:energy"=0]
scoreboard players add @a[tag=flowing_block_2] magicpoint 25
execute at @a[tag=flowing_block_2] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_2] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_2] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_2] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_2] run particle dec:white_star_particle ~~~
tag @a remove flowing_block_2

##流动块三级
execute as @a[scores={magicpoint=..35}] at @s if block ~ ~-0.1 ~ dec:flowing_block ["dec:energy"=3] run tag @s add flowing_block_3
execute as @a[scores={magicpoint=..35}] at @s if block ~ ~-0.1 ~ dec:flowing_block ["dec:energy"=3] run setblock ~~-0.1 ~ dec:flowing_block ["dec:energy"=0]
scoreboard players add @a[tag=flowing_block_3] magicpoint 40
execute at @a[tag=flowing_block_3] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_3] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_3] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_3] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_3] run particle dec:white_star_particle ~~~
tag @a remove flowing_block_3

##流动块四级
execute as @a[scores={magicpoint=..35}] at @s if block ~ ~-0.1 ~ dec:flowing_block ["dec:energy"=4] run tag @s add flowing_block_4
execute as @a[scores={magicpoint=..35}] at @s if block ~ ~-0.1 ~ dec:flowing_block ["dec:energy"=4] run setblock ~~-0.1 ~ dec:flowing_block ["dec:energy"=0]
scoreboard players add @a[tag=flowing_block_4] magicpoint 60
execute at @a[tag=flowing_block_4] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_4] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_4] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_4] run particle dec:white_star_particle ~~~
execute at @a[tag=flowing_block_4] run particle dec:white_star_particle ~~~
tag @a remove flowing_block_4

##潜影蘑菇
execute at @a run fill ~-5 ~-5 ~-5 ~5 ~5 ~5 dec:lurk_mushroom_lit [] replace dec:lurk_mushroom []

##监视者
execute at @a[tag=gaming] run fill ~-4 ~-4 ~-4 ~4 ~4 ~4 dec:monitor_activated [] replace dec:monitor []

##潜影末地石
execute as @e at @s if block ~~-0.1~ dec:lurk_end_stone [] run effect @s slowness 2 0

##辐射土
execute at @e[type=!dec:werewolf,type=!dec:dark_werewolf,type=!dec:radiate_creeper,type=!dec:radiate_skeleton,type=!dec:radiate_enderman,type=!zombie,type=!dec:radiate_spider] as @s if block ~~-0.1~ dec:radiate_dirt [] run effect @s poison 5 0
execute at @e[scores={magicpoint=1..}] as @s if block ~~-0.1~ dec:radiate_dirt [] run scoreboard players remove @s magicpoint 1

##辐射石头
execute at @e[type=!dec:werewolf,type=!dec:dark_werewolf,type=!dec:radiate_creeper,type=!dec:radiate_skeleton,type=!dec:radiate_enderman,type=!zombie,type=!dec:radiate_spider] as @s if block ~~-0.1~ dec:radiate_stone [] run effect @s poison 5 0
execute at @e[scores={magicpoint=1..}] as @s if block ~~-0.1~ dec:radiate_stone [] run scoreboard players remove @s magicpoint 1

##辐射石砖
execute at @e[type=!dec:werewolf,type=!dec:dark_werewolf,type=!dec:radiate_creeper,type=!dec:radiate_skeleton,type=!dec:radiate_enderman,type=!zombie,type=!dec:radiate_spider] as @s if block ~~-0.1~ dec:radiate_stonebrick [] run effect @s poison 5 0
execute at @e[scores={magicpoint=1..}] as @s if block ~~-0.1~ dec:radiate_stonebrick [] run scoreboard players remove @s magicpoint 1