scoreboard players set MagicDisplay global 1
scoreboard objectives add magicdisplay dummy §bMagicPoint§r
tellraw @a { "rawtext" : [ { "translate" : "text.dec:magic_display_on.name" } ] }