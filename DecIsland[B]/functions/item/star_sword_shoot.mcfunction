execute if entity @s[scores={magicpoint=15..}] run particle dec:fire_powering_particle ~~0.5~
tag @s[scores={magicpoint=15..}] add shot
execute if entity @s[scores={magicpoint=15..}] run playsound fire.fire @a ~~~ 1.4
execute if entity @s[scores={magicpoint=15..}] run playsound mob.blaze.shoot @a ~~~
scoreboard players remove @s[scores={magicpoint=15..}] magicpoint 15