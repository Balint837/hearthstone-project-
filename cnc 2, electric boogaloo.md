ive got no fucking clue how I want to do this yet
plz dont look at this file yet ;(


{atk, def, mana_cost, on_play, on_turnend, on_death,
 on_attack, on_spell, is_taunt, instant_atk, is_spell}

\* ==> csak 1 db lehet a deckbe, minden másból 2 lehet \
divine shield = első sebződést elnyeli és lemegy róla \
fm = friendly minion \
format:
\<real index>:\<hero index>


functions:
- summonCardToHand(card_idx)
- summonCardToDeck(card_idx)
- ForceDrawCard(count)
- ForceDrawType(cards, count)
- ForceDrawCondition(condition, count)
- returnToDeck(target.id)
- returnToHand(target.id)
- DamageObjects([target1.id, ....., targetN.id], this.id)

If these cannot describe an ability then plain text is used to describe them. \
(When entering them in JS just enter a string with a description, they'll be implemented later.) \
(There may also be cases when I've got no idea wtf you wanted to say lol)

()=>{} 

Mage
------------
- 1:1. 0,0,1, spell ur hp deals +1 dmg (ha nem leeht megoldani: onplay deal 3 dmg) (For the rest of the game your Hero Power deals +1 damage.)
- 2:2. 0,0,1, spell deal 2 dmg twice to a minion (if divine shield, only once)
- 3:3. 2,2,1
- 4:4. 0,0,2, spell deal 2 dmg and return this to your deck (ha nem lehet megoldani: onplay deal 3 dmg twice)
- 5:5. 2,2,2, on play deal 2 damage
- 6:6. 2,3,2, on play draw a spell
- 7:7. 0,0,2, spell heal your hero 5 heathpoints
- 8:8. 0,0,7, spell, deal 5 dmg to all enemy minions
- 9:9*. 8,8,8, if you dealt 10 dmg with heropower deal 10 dmg to all enemys
- 10:10*. 5,7,7, if you cast a spell add a '4 mana deal 6 dmg spell' (11:11)
- 11:11. 0,0,4, spell, deal 6 dmg
- 12:12. 0,0,10, deal 10 dmg
- 13:13. 4,5,5, , , , , , false, false, false
- 14:14. 0,0,4, transform a minion into a 1/1 sheep (102:+1), , , , , false, false, true
- 15:15. 3,6,4, on play destroy a random enemy minion
- 16:16. 3,5,4, on play deal 3 damage to all enemy minions, , , , , false, false, false

- 102:+1. 1,1,1

total: 30

<!-- 99: +*. (WEAPON) 0,3,6, , draw 3 cards until your hand is full (you dont overdraw from this but from turn start draw you will), , , , false, false, false -->

Hunter
------------
- 17:1. 0,0,1, deal 2 dmg, , , , , false, false, true
- 18:2. 0,0,1, set a minion's def to 1, , , , , false, false, true
- 19:3. 1,1,1, summon a copy of this to the board, , , , , false, true, false
- 20:4. 0,0,3, destroy a random enemy minion, , , , , false, false, true
- 21:5*. 2,4,7, summon an 8/8 instant_attack (23:7), , , , , false, false, false
- 22:6*. 5,6,3, , , , , , false, false, false 
- 23:7*. 8,8,8, , , , , , false, true, false
- 24:8*. 5,5,8, summon 3 minions from ur hand (takes them out from hand, on_play doesnt activate), , , , , false, false, false
- 25:9. 0,0,10, summon 4 3/5 (104:+1) minions, , , , , false, false, true
- 26:10. 0,0,7, summon two minions from your deck, , , , , false,false, true
- 27:11. 0,0,4, deal 6 dmg, , , , , false, false, true
- 28:12. 3,3,4, , , summon two 1/1 (102:+1.) minions, , , false, false, false
- 29:13. 0,0,4, deal 3 dmg to two random enemy minions, , , , , false, false, true
- 30:14. 0,0,3, deal 4 dmg , , , , , false, false, true 
- 31:15. 1,2,3, , , summon a 4/4, , , false, false, false
- 32:16. 2,5,3, , , , , , false, false, false
- 33:17. 0,0,1, buff 1+/+1 + summon 1/1 + add 1/1 to hand (102:+1), , , , , false, false, true


- 104:+1. 3,5,4, , , , , , false, true, false
- 105:+2. 4,4,4, , , , , , false, false, false
 
total:30


Paladin
------------
- 34:1. 1,1,1, , , , , , true, false, false
- 35:2. 1,1,1, Draw 1, , , false, false, false
- 36:3. 0,0,1, heal 2, put this back to your hand, , , , , false, false, true
- 37:4. 3,2,2, give +2 heath to a friendly minion, , , , , false, false, false //!!!!!THIS CARD WAS MISSED
- 38:5. 0,0,2, set all minions health to 1, , , , , false, false, true
- 39:6. 2,3,2, , , , , summon a 2/2 (107:+2), false, false, false
- 40:7.* 3,3,3, give a fm +3/+3, ,  , , , false, false, false
- 41:8. 0,0,4, give a minion +4/+4, , , , , false, false, true
- 42:9. 0,0,4, summon 5 1/1 minions (102:+1), , , , , false, false, true
- 43:10. 5,5,5, summon another 5/5 (43:10) if you dont have any other minions, , , , , true, false, false
- 44:11. 8,8,8, , , , summon 5/5 taunt (43:10), , false, false, false
- 45:12. 5,5,5, , , , , , true, false, false
- 46:13. 0,0,3, summon two (102:+1) and then give all fm's +1/+1, , , , , false, false, true
- 47:14. 3,3,3, , , , heal the dmg of this minion to your hero (on_attack), , false, false, false
- 48:15. 2,5,3, if u have a spell in ur hand gain taunt, , , , , false(true if fulfilled), false, false
- 49:16*. 4,4,5, transform your minions into 3/3 (106:+1), , , , , false, false, false

- 106:+1. 3,3,3, , , , , true, false, false
- 111+2. 1,1,1, , , , , , false, true, false

total:30
<!-- 
Death Knight
------------
- 50:1*. 3,5,5, , , add this to your hand but costs health instead (103:+1), , , true, false, false
- 51:2*. 7,7,7, for the rest of the game deal 3 dmg to your opponent at the end of your turns, , , , , false, false, false
- 52:3. 5,5,8, destroy all other mininons, , , , , false, false, false
- 53:4. 5,2,6, , , , dmg dealt heals your hero. this can only take 1 dmg at a time. dmg taken damages your hero, , false, true, false
- 54:5. 0,0,4, deal 6 dmg to a minion. dmg dealt heals your hero, , , , , false, false, true
- 55:6. 1,2,1, deal 2 dmg to an enemy and your hero, , , , , false, false, false
- 56:7. 0,0,1, deal 3 dmg to a minion, , , , , false, false, true
- 57:8. 0,0,4, give ur minions +1/+0. if u can spend 5 corpses give +3/+0, , , , , false, false, true
- 58:9. 0,0,1, gain 4 corpses. shuffle 4 {2,2,0,} cards to your deck, , , , , false, false, true
- 59:10. 3,3,3, , , if u can spend 3 corpses summon 3/3 is_taunt, , , true, false, false
- 60:11*. 3,3,3, give all enemy minions on_death summon a 2/2 is_taunt, , , false, false, false
- 61:12. 1,2,1, give a friendly minion +2/+0, , , , , false, false, false
- 62:13*. 4,6,7, destroy a random minion from your opponents hand and deck and table, , , , , false, false, false
- 63:14. 2,2,2, spend one corpse to gain +1/+2, , , , , false, false, false
- 64:15. 0,0,2, destroy a minion and your hero takes dmg equal to its health, , , , , false, false, true
- 65:16. 0,0,2, give ur hero +5 health (can go over 30). spend 3 corpses to gain 5 more and draw a card, , , , , false, false, true
- 66:17. 0,0,2, draw a card. spend two corpses to draw another, , , , , false, false, true


- 103:+1. 3,5,0, take 5 health from hero, , return this to your hand, , , true, false, false
- 107:+2. 2,2,0, , , , false, false, false

total:30


Warlock
------------
- 67:1. 3,2,1, deal 3 dmg to your own hero, , , , , false, false, false
- 68:2. 0,0,1, destroy a friendly minion and deal 2 dmg to all enemy minions, , , , , false, false, true
- 69:3. 0,0,5, destroy an enemy minion then restore 3 health to your hero, , , , , false, false, true
- 70:4. 0,0,8, destroy all minions, , , , , false, false, true
- 71:5. 0,0,3, draw 3 cards then deal 3 dmg to your hero, , , , , false, false, true
- 72:6. 3,4,3, shuffle 2 soul fragments to your deck (108:+1), , draw a card, , , false, false, false
- 73:7. 1,5,2, , , , , , true, false, false
- 74:8. 6,4,6, , , summon two 3/2 minions to your board without on_play (67:1), , , true, false, false
- 75:9*. 5,5,7, for each soul fragments (108:+1) in your deck summon a 3/3 with instant_atk, , , , , false, false, false
- 76:10. 0,0,2, deal 3 dmg to a minion shuffle two soul fragments (108:+1) into your deck, , , , , false, false, true
- 77:11. 0,0,3, deal 2 dmg to all minions shuffle 2 soul fragments (108:+1) into your deck, , , false, false, true
- 78:12. 1,3,1, shuffle two soul fragments (108:+1) into your deck, , , , , false, false, true
- 79:13*. 4,4,7, increase you max hand size to 12. draw 4 cards, , , , , false, false, false
- 80:14. 1,1,4, , , summon a copy of this (80:14), , , false, false, false
- 81:15. 3,9,9, , , summon 3 1/3 (109:+2) minions with is_taunt, , , true, false, false
- 82:16*. 8,6,6, restore 5 mana if you have 9 cards left in your hand (you had a full hand while holding this), , , , , false, false, false


- 108:+1 0,0,0, heal 2 to hero
- 109:+2 1,3,1, , , , , , true, false, false

total:30

100: +*. (WEAPON) 0,3,5, , summon a minion from hand for free, , , , false, false, false
 -->


Priest
------------
- 83:1. 0,0,0, heal 4 to all minions, , , , , false, false, true
- 84:2. 0,0,6, set the attack of all enemy minions to 1, , , , , false, false, true
- 85:3. 0,0,1, dmg 3 to a minion, , , , , false, false, true
- 86:4. 0,0,1, COPY a card from opponent hand(add it to yours), , , , , false, false, true
- 87:5. 0,0,2, copy 2 cards from your opponents deck add it to your hand, , , , , false, false, true
- 88:6. 0,0,5, summon a copy of a friendly minion with 5/5 stats, , , , , false, false, true
- 89:7. 0,0,5, give a minion +1/+2 then copy the minion, , , , , false, false, true
- 90:8* 4,6,7, shuffle a copy of your opponents deck into your deck
- 91:9* 0,0,9, summon 3 minions from your deck onto your board, , , , , false, false, true
- 92:10. 2,6,5, , , Destroy a random enemy minion, , , true, false, false
- 93:11. 5,4,4, , , , , on spell: deal 4 dmg to both heroes, false, false, false
- 94:12. 0,0,4, copy 2 cards from your opponents hand add it to your hand, , , , , false, false, true
- 95:13. 5,5,5, restore 5 heath to your hero , , , , , false, false, false
- 96:14. 2,3,2, +0/+2 to a friendly minion, , , , , false, false, false
- 97:15. 4,3,4, deal 3 dmg to enemy hero, , , , , false, false, false
- 98:16. 6,6,6, , , restore 8 health to all friendly characters (including hero), , , true, false, false

- 110:+1. 5,5,5,  , , , , , false, false, false

total:30
<!-- 
101: +*. (WEAPON) 0,3,3, , , , , if you cast 3 spells this turn summon a 5/5 minion (110:+1), false, false, false
 -->






Norbi lap:
111:+-. 0atk,10hp,0mana, taunt
hp: turn all placed cards into norbi