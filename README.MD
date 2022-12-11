# Hearthstone
- Turn system
    - Sleep on newly summoned (unless special)
- ~~AI Enemy~~ --> PVP
- Deck, Pulling
    - Fatigue --> Take increasing damage on empty deck
    - Multiple draw support
- Placement
- Max table (7)
- Max hand (10)
    - Overdraw: Pulls over 10 are discarded
- Mana System --> Only on placement
    - Refills per turn
    - +1 to max
    - 10 max
- Rotation system between players
- Extra power / Hero Power
    - Buffs (Atk / def)
    - Heals
    - DMG
    - New card / semi-random Summon (some type)
    - Complex (e.g. damage-self + draw)
- Card buffs / relations (Can be permanent)
- Minimal animation




# Planning

## Format
- Can multiply --> List
    - e.g. Cards in hand/deck
- Unique --> Dictionary (Maybe class?)
    - e.g. Card types

## Functions
- Turn system --> Negate boolean
    - Rotation system --> On turn change, possibly triggered by boolean?
    ```
    P = 1, S = False -> Presses button
    P = 2, S = True -> Player changed but hidden
    P2 presses another button -> S = False
    ```
- Deck --> List of card types (maybe list of classes?)
- Pulling --> Start of turn (maybe include in increment()?)
    - Overdraw --> Just do literally nothing
    - Fatigue --> Explains itself
    - Multiple draws --> Pain
- Max hand --> Array (hand.length < max_hand+1)
- Max table --> Array (table.length < max_table+1)
- Mana System
```
mana_cap = 10
max_mana = 1
current = max_mana


increment(){
    if max_mana < mana_cap:
        max_mana += 1
    current = max_mana
}
```
- Placement --> List of card types + properties
- Hero Power --> Store buffs + etc. in placed card properties
- Card relations --> Possibly ID property?
- Permanent effects --> Add to seperate list (on_play event)

- Minimal animation --> Bruh

- Minimal responsivity --> Pain