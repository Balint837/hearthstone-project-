class Card {
    constructor(atk=0, def=0, mana_cost, on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="", is_weapon=false){
        this.atk = atk; // int
        this.def = def; // int
        this.mana_cost = mana_cost; // int
        this.on_play = on_play; // list of functions
        this.on_turnend = on_turnend; // list of functions
        this.on_death = on_death; // list of functions
        this.on_attack = on_attack; // list of functions
        this.on_spell = on_spell; // list of functions
        this.on_damage = on_damage; // list of functions
        this.is_taunt = is_taunt; // bool
        this.instant_atk = instant_atk; // bool
        this.is_spell = is_spell; // bool
        this.is_protected = is_protected; // bool
        this.is_weapon = is_weapon; // bool
        this.description = description; // string
        //Battlecry = onplay
        //Deathrattle = ondeath
        //Taunt = istaunt
        //Charge = instantattack
        //Divine shield = isprotected
        //Poisonous = instakill when damaged
    }
};


class Hero{
    constructor(hero_power=(target)=>{}, hp_description="Placeholder description"){
        this.hp = 30;
        this.max_hp = 30;
        this.weapon = null;
        this.fatigue = 0;
        this.hero_power = hero_power;
        this.description = hp_description;
        this.may_attack = true;
        this.hp_buff = 0;
    }
    /*hero_power is prob an instance for now, can't think of anything yet*/
}

function summonCardToHand(kwargs){
    card_idx = kwargs["card_idx"]
}
function summonCardToDeck(kwargs){
    card_idx = kwargs["card_idx"]
}
function ForceDrawCard(kwargs){
    count = kwargs["count"]
}
function ForceDrawType(kwargs){
    cards = kwargs["cards"]
    count = kwargs["count"]
}
function ForceDrawCondition(kwargs){
    count = kwargs["count"]
}
function returnToDeck(kwargs){
    targetID = kwargs["targetID"]
}
function returnToHand(kwargs){
    targetID = kwargs["targetID"]
}
function DamageObjects(kwargs){
    targets = kwargs["targets"]
    initiator = kwargs["thisID"]
}


function GetCardBySelector(selector){
    try {
        t = selector.split(".")
        switch (t[0]) {
            case "random":
                switch(t[1]){
                    case "hand":
                        if (+t[2] == NaN){
                            return false;
                        }
                        
                        if (hands[+t[2]].length == 0){
                            return null;
                        }
                        return randChoices(hands[+t[2]], 1)[0]
                    case "table":
                        if (+t[2] == NaN){
                            return false;
                        }
                        if (table[+t[2]].length == 0){
                            return null;
                        }
                        return randChoices(table[+t[2]], 1)[0]
                    case "deck":
                        if (+t[2] == NaN){
                            return false;
                        }
                        if (decks[+t[2]].length == 0){
                            return null;
                        }
                        return randChoices(decks[+t[2]], 1)[0]
                    default:
                        return false;
                    }
            case "hand":
                return hands[+t[1]][+t[2]];
            case "table":
                return table[+t[1]][+t[2]];
            case "heropower":
                return selector
            case "hero":
                return selector
            case "weapon":
                // if (t.length > 1) {
                //     return weapons[+t[1]]
                // }
                return weapons[+player]
            case "ID":
                return id_dict[+t[1]]
            default:
                return null;
        }
    } catch (error) {
        return null;
    }
}

// ID.<id>
// weapon
// table.<player>.<idx>
// hand.<player>.<idx>
// hero.<player>
// heropower.<player>

function GetIdFromIdSelector(selector){
    return +selector.split(".")[1]
}

function AttackWithCard(attacker, target){
    console.log(attacker, target)
    splitAttacker = attacker.split(".")
    splitTarget = target.split(".")
    attackerCard = GetCardBySelector(attacker);
    console.log(attackerCard.may_attack, splitAttacker[1], splitTarget[1])
    if (!attackerCard.may_attack || splitAttacker[1] == splitTarget[1] || +splitAttacker[1] != +player) {
        console.log("disallowed attack");
        selected = [null, null];
        updateAll();
        allow_table = true;
        return;
    }
    switch (splitTarget[0]) {
        case "hero":
            heroes[selected_heroes[+splitTarget[1]]].hp -= attackerCard.atk;
            attackerCard.may_attack = false;
            selected = [null, null];
            return updateAll();
        case "weapon":
            selected = [null, null];
            return updateAll();
        default:
            break;
    }
    targetCard = GetCardBySelector(target);
    console.log(targetCard.hp, attackerCard.atk)
    console.log(attackerCard, targetCard)
    targetCard.hp -= attackerCard.atk;
    attackerCard.may_attack = false;
    console.log("attacked with card");
    selected = [null, null];
    updateAll();
    allow_table = true;
}

function DamageAnything(target, damage){
    splitTarget = target.split(".")
    console.log(splitTarget)
    if (splitTarget[0] == "random") {
        if (splitTarget[1] != "table") {
            return false;
        }
        if (table[+!player].length == 0) {
            return false;
        }
        table[+!player][exclusiveRandRange(0, table[+!player].length)].hp -= damage;
        updateAll();
        return true;
    }
    if (splitTarget.length < 3) {
        
        switch (splitTarget[0]) {
            case "table":
                if (+splitTarget[1] == NaN) {
                    return false;
                }
                for (let index = 0; index < table[+splitTarget[1]].length; index++) {
                    DamageAnything(`table.${+splitTarget[1]}.${index}`, damage);
                }
                return true;
            case "all":
                if (+splitTarget[1] == NaN) {
                    return false;
                }
                for (let index = 0; index < table[+splitTarget[1]].length; index++) {
                    DamageAnything(`table.${+splitTarget[1]}.${index}`, damage);
                }
                DamageAnything(`hero.${+splitTarget[1]}`, damage);
                return true;
            default:
                break;
        }
    }
    targetCard = GetCardBySelector(target)
    switch (typeof targetCard) {
        case typeof card_types[0]:
            targetCard.hp -= damage;
            selected = [null, null]
            updateAll();
            return true;
        case typeof "":
            switch (splitTarget[0]) {
                case "hero":
                    if (+splitTarget[1] != NaN) {
                        heroes[selected_heroes[+splitTarget[1]]].hp -= damage;
                        if (heroes[selected_heroes[+splitTarget[1]]].hp > heroes[selected_heroes[+splitTarget[1]]].max_hp){
                            heroes[selected_heroes[+splitTarget[1]]].hp = heroes[selected_heroes[+splitTarget[1]]].max_hp
                        }
                    }
                    else{
                        heroes[selected_heroes[+!player]].hp -= damage;
                        if (heroes[selected_heroes[+!player]].hp > heroes[selected_heroes[+!player]].max_hp){
                            heroes[selected_heroes[+!player]].hp = heroes[selected_heroes[+!player]].max_hp
                        }
                    }
                    selected = [null, null]
                    updateAll();
                    return true;
                default:
                    break;
            }
        default:
            break;
    }
    selected = [null, null]
    updateAll();
    return false

}

function UseHeroPower(target){
    if (current_mana[+player] < 2){
        console.log("not enough mana for hp")
        selected = [null, null];
        return updateAll();
    }
    current_mana[+player] -= 2;
    current_hero = heroes[selected_heroes[+player]]
    if (!current_hero.may_attack) {
        selected = [null, null]
        return updateAll();
    }
    if (!current_hero.hero_power(target)) {
        selected = [null, null]
        return updateAll();
    }
    current_hero.may_attack = false;
    updateAll();
}


function SummonMinion(idx){
    if (table[+player].length >= max_table) {
        console.log("max table reached")
        selected = [null, null];
        return updateAll();
    }
    console.log("summon:", max_id)
    new_summon = new PlacedCard(idx);
    table[+player].push(new_summon)
    selected = [null, null]
    console.log("summonminion:", new_summon, table[+player], max_id)
    console.log("summoned card")
    updateAll();
}

function BuffCard(target, values){
    values = values.split(" ")
    atkbuff = +values[0]
    defbuff = +values[1]
    tempBuffCard = GetCardBySelector(target)
    if (typeof tempBuffCard != typeof card_types[0]) {
        return false;
    }
    tempBuffCard.atk += atkbuff;
    tempBuffCard.hp += defbuff;
}

function DestroyCard(target){
    splitTarget = target.split(".");
    tempDestroyCard = GetCardBySelector(target);
    if (typeof tempDestroyCard != typeof card_types[0]) {
        return false;
    }
    if (tempDestroyCard == null){
        return true;
    }
    RemoveCard(target);
    console.log(tempDestroyCard, tempDestroyCard.card.on_death)
    tempDestroyCard.card.on_death.forEach(ondeath_function => {
        ondeath_function();
    });
    return true;
}

function RemoveCard(target){
    splitTarget = target.split(".");
    switch (splitTarget) {
        case "random":
            switch (splitTarget[1]) {
                case "table":
                    if (+splitTarget[2] == NaN) {
                        return false
                    }
                    if (table[+splitTarget[2]].length == 0) {
                        return false;
                    }
                    table[+splitTarget[2]].splice(exclusiveRandRange(0, table[+splitTarget[2]].length), 1)
                    return true;
                case "hand":
                    if (+splitTarget[2] == NaN) {
                        return false
                    }
                    if (hands[+splitTarget[2]].length == 0) {
                        return false;
                    }
                    hands[+splitTarget[2]].splice(exclusiveRandRange(0, hands[+splitTarget[2]].length), 1)
                    return true;
                case "deck":
                    if (+splitTarget[2] == NaN) {
                        return false
                    }
                    if (decks[+splitTarget[2]].length == 0) {
                        return false;
                    }
                    decks[+splitTarget[2]].splice(exclusiveRandRange(0, decks[+splitTarget[2]].length), 1)
                    return true;
                default:
                    return false;
            }
        case "table":
            if (+splitTarget[1] == NaN || +splitTarget[2] == NaN) {
                return false;
            };
            table[+splitTarget[1]].splice(+splitTarget[2], 1)
            return true;
        case "hand":
            if (+splitTarget[1] == NaN || +splitTarget[2] == NaN) {
                return false;
            };
            hands[+splitTarget[1]].splice(+splitTarget[2], 1)
            return true;
        case "deck":
            if (+splitTarget[1] == NaN || +splitTarget[2] == NaN) {
                return false;
            };
            decks[+splitTarget[1]].splice(+splitTarget[2], 1)
            return true;
        default:
            return false;
    }
}

function ShuffleToDeck(idx, current_player=player){
    if (idx >= card_types.length){
        return false;
    }
    decks[+current_player].splice(exclusiveRandRange(0, decks[+current_player].length), 0, idx)
    return true;
}


function TransformMinion(target, idx){
    splitTarget = target.split(".")
    if (splitTarget[0] != "table") {
        console.log("disallowed transform")
        selected = [null, null];
        return updateAll();
    }
    table[+splitTarget[1]][+splitTarget[2]] = new PlacedCard(idx);
    selected = [null, null]
    console.log("transformed card")
    updateAll();
}


function CopyBySelectorToHand(target, current_player=player){
    tempCopyS = GetCardBySelector(target)
    splitTarget = target.split(".");
    switch (typeof tempCopyS) {
        case typeof card_types[0]:
            hands[+current_player].push(tempCopyS.card_idx)
            return true;
        case typeof 0:
            hands[+current_player].push(tempCopyS)
            return true;
        default:
            return false;
    }
}




let IdSearchFunction = (array, ID)=>{return Array.prototype.findIndex.call(array, (element)=>{console.log(element.id);return element.id == ID})}
let UniversalIndexer = (array, value, func)=>{return Array.prototype.findIndex.call(array, func)}
function GetSelectorFromId(ID, prefer_index=true, default_return=null){
    
    t = IdSearchFunction(weapons, ID)
    if (t != -1) {
        if (t == +player) {
            if (prefer_index) {
                return `weapon.${t}`
            }
            return "weapon"
        }
        else{
            return `weapon.${t}`
        }
    }


    // console.log("searching")
    for (let i = 0; i < 2; i++) {
        t = IdSearchFunction(table[i], ID)
        // console.log(table[i])
        // console.log(t)
        if (t != -1) {
            return `table.${i}.${t}`
        }
    }
    
    // console.log(default_return)
    return default_return
}

function selectCardbySelector(selector){
    // console.log(selected, selector)
    splitSelector = selector.split(".");
    if (splitSelector[0] == "ID"){
        selector = GetSelectorFromId(+splitSelector[1], true, selector)
        splitSelector = selector.split(".");
    }
    console.log(selected, selector, splitSelector)
    if (selector == "table" && !allow_table){
        console.log("disallowed table")
        allow_table = true
        return updateAll();
    }
    switch (selected[0]) {
        case null:
            selected[0] = selector;
            if (splitSelector[0] == "table") {
                allow_table = false;
            }
            return updateAll();

        case selector:
            console.log("unselected card")
            selected = [null, null];
            if (splitSelector[0] == "table") {
                allow_table = false;
            }
            return updateAll();

        default:
            splitSelected = selected[0].split(".");
            switch (splitSelected[0]) {
                case "hand":
                    switch (splitSelector[0]) {
                        case "hand":
                            selected[0] = selector;
                            return updateAll();
                        
                        case "table":
                            return PlaceCard(selected[0]); //selected = [null, null]
                        default:
                            return;
                    }
                case "table":
                    if (+splitSelected[1] != NaN && +splitSelected[2] != NaN && splitSelected[1] != undefined && splitSelected[2] != undefined) {
                        switch (splitSelector[0]) {
                            case "table":
                                if (+splitSelector[1] != NaN && +splitSelector[2] != NaN && splitSelector[1] != undefined && splitSelector[2] != undefined) {
                                    return AttackWithCard(selected[0], selector) //selected = [null, null]
                                }
                                else {
                                    selected = [null, null];
                                    return updateAll();
                                }
                            case "hand":
                                selected[0] = selector;
                                return updateAll();
                            case "hero":
                                if (+splitSelector[1] != NaN && splitSelector[1] != undefined) {
                                    return AttackWithCard(selected[0], selector) //selected = [null, null]
                                }
                                else {
                                    selected = [null, null];
                                    return updateAll();
                                }
                            case "weapon":
                                if (+splitSelector[1] != NaN && splitSelector[1] != undefined) {
                                    return AttackWithCard(selected[0], selector) //selected = [null, null]
                                }
                                else {
                                    selected = [null, null];
                                    return updateAll();
                                }
                            default:
                                return;
                        }
                    }
                    else {
                        selected[0] = selector;
                        return updateAll();
                    }
                case "heropower":
                    switch (splitSelector[0]) {
                        case "table":
                            if (+splitSelector[1] != NaN && +splitSelector[2] != NaN) {
                                return UseHeroPower(selector) //selected = [null, null]
                            }
                            else {
                                selected = [null, null];
                                return updateAll();
                            }
                        case "hero":
                            return UseHeroPower(selector);
                        default:
                            selected = [null, null];
                            return updateAll();
                    }
                default:
                    selected[0] = selector;
                    return updateAll();
            }
    }
}


function PlaceCard(selector, current_player=player){
    splitSelector = selector.split(".");
    idx = GetCardBySelector(selector)
    queryMana = card_types[idx].mana_cost
    if (current_mana[+current_player] < queryMana){
        console.log("not enough mana")
        selected = [null, null];
        return updateHands();
    }
    if (table[+current_player].length > max_table) {
        console.log("max table surpassed")
        selected = [null, null];
        return updateHands();
    }
    else if (table[+current_player].length == max_table){
        if (!card_types[idx].is_spell) {
            console.log("max table reached")
            selected = [null, null];
            return updateHands();
        }
    }
    console.log("place: ",max_id)
    new_card = new PlacedCard(idx);
    console.log("place:", idx, card_types[idx].is_weapon, new_card.id)
    if (card_types[idx].is_weapon) {

        heroes[selected_heroes[+current_player]].weapon = new_card
        removeMana(queryMana, current_player)
        hands[+current_player].splice(+splitSelector[splitSelector.length-1], 1)
        selected = [null, null]
        console.log("placed weapon")
    }
    else{
        new_card.card.on_play.forEach(
            onplay_function =>
            {
                console.log("onplay:", max_id);
            onplay_function()
            }
        );
        table[+current_player].push(new_card)
        removeMana(queryMana, current_player)
        hands[+current_player].splice(+splitSelector[splitSelector.length-1], 1)
        if (new_card.is_spell){
            RunOnSpells();
        }
        selected = [null, null]
        console.log("placed card")
    }
    updateAll();
    console.log("placecard:", new_card, table[+current_player], max_id)
}


function MustPlaceLastHand(){
    idx = hands[+player].at(-1)
    if (table[+player].length > max_table) {
        console.log("max table surpassed")
        hands[+player].splice(hands[+player].length, 1)
        selected = [null, null];
        return updateHands();
    }
    else if (table[+player].length == max_table){
        if (!card_types[idx].is_spell) {
            console.log("max table reached")
            hands[+player].splice(hands[+player].length, 1)
            selected = [null, null];
            return updateHands();
        }
    }
    new_card = new PlacedCard(idx);
    console.log("place:", idx, card_types[idx].is_weapon)
    if (card_types[idx].is_weapon) {
        heroes[selected_heroes[+player]].weapon = new_card
        selected = [null, null]
        console.log("placed weapon")
    }
    else{
        new_card.card.on_play.forEach(
            onplay_function =>
            {
            onplay_function()
            }
        );
        table[+player].push(new_card)
        if (new_card.is_spell){
            RunOnSpells();
        }
        selected = [null, null]
        console.log("placed card")
    }
    hands[+player].splice(hands[+player].length, 1)
    updateAll();
}

function selectCardbyId(){

}

function updateAll(){
    updateHands();
    updateTable();
    updateDecks();
    updateMana();
    updateHero();
}

function removeMana(card_cost, current_player=player) {
    current_mana[+current_player] -= card_cost;
    updateMana()
}

function updateWeapon(){

}

function updateMana(){
    for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
        const manaCounter = document.getElementById(`p${playerIdx+1}Mana`)
        manaCounter.innerHTML = `${current_mana[playerIdx]}/${max_mana[playerIdx]}`
        for (let i = 0; i < current_mana[playerIdx]; i++){
            const mana = document.createElement('div')
            mana.className = 'mana'
            manaCounter.appendChild(mana)
        }
        
    }
}

function updateDecks(){
    for (let index = 0; index < 2; index++) {
        deckElem = document.getElementById(`p${index+1}Deck`)
        deckElem.innerText = "Cards: " + decks[index].length
        
    }
}

function setHero(){
    heroIdxs = [
        ["Mage", "mage.png"],
        ["Hunter", "hunter.png"],
        ["Paladin", "paladin.png"],
        ["Death Knight", "deathknight.png"],
        ["Warlock", "warlock.png"],
        ["Priest", "priest.png"],
        ["Norbert", "norbert.png"],
    ]
    for (let index = 0; index < 2; index++) {
        document.querySelector(`#p${index+1}Hero`).innerHTML = 
        `<div class="playCard">
            <div class="inner-row">
                <div>
                    <img src="heroes/${heroIdxs[selected_heroes[+index]][1]}" alt="${heroIdxs[selected_heroes[+index]][0]}">
                </div>
            </div>
            <div class="inner-row">
                <div class="defdisplay">
                    ${heroes[selected_heroes[+index]].hp}/${heroes[selected_heroes[index]].max_hp}
                </div>
            </div>
        </div>`
        
        document.querySelector(`#p${index+1}HeroPower`).innerHTML = 
        `<div class="playCard" style="${(selected[0] == `heropower.${index}` || selected[0] == "heropower")?"background-color: rgb(100, 255, 100)":""}">
            <div class="inner-row">
                <div class="description">
                    ${heroes[selected_heroes[+index]].description}
                </div>
            </div>
            <div class="inner-row">
                <div class="manadisplay">
                    2
                </div>
            </div>
        </div>`
        
    }
    updateWeapon();
}

function updateHero(){
    for (let index = 0; index < 2; index++) {
        setHero();
        if (heroes[selected_heroes[index]].hp <= 0) {
            current_scene = 4
        }
    }
    if (current_scene == 4){
        end_game();
    }
}

function updateHands(){
    updateDecks()
    for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
        handElem = document.getElementById(`p${playerIdx+1}Hand`)
        handElem.innerHTML = ""
        for (let cardIdx = 0; cardIdx < hands[playerIdx].length; cardIdx++) {
            value = hands[playerIdx][cardIdx]
            // console.log(value)
            if (playerIdx == +player) {
                handElem.innerHTML += `<div class="playCard" style="z-index: ${cardIdx+1};${selected[0] == `hand.${playerIdx}.${cardIdx}`?"background-color: rgb(100, 255, 100)":""}" onclick="selectCardbySelector('hand.${playerIdx}.${cardIdx}')">
                                        <div class="inner-row">
                                            <div class="description">${card_types[value].description}</div>
                                        </div>
                                        <div class="inner-row">
                                            <div class="atkdisplay">
                                                ${card_types[value].atk}
                                            </div>
                                            <div class="manadisplay">
                                                ${card_types[value].mana_cost}
                                            </div>
                                            <div class="defdisplay">
                                                ${card_types[value].def}
                                            </div>
                                        </div>
                                    </div>`
            }
            else{
                handElem.innerHTML += `<div class="playCard" style="z-index: ${cardIdx+1};" onclick="selectCardbySelector('hand.${playerIdx}.${cardIdx}')">
                                        <div class="inner-row">
                                            <div class="description"></div>
                                        </div>
                                        <div class="inner-row">
                                            <div class="atkdisplay">
                                            </div>
                                            <div class="manadisplay">
                                            </div>
                                            <div class="defdisplay">
                                            </div>
                                        </div>
                                    </div>`
            }
            
            
        }
        
    }
}

function updateTable(){
    for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
        for (let cardIdx = 0; cardIdx < table[playerIdx].length; cardIdx++){
            if (table[playerIdx][cardIdx].hp <= 0){
                tempDeadCard = table[playerIdx][cardIdx]
                table[playerIdx].splice(cardIdx);
                cardIdx--;
                tempDeadCard.card.on_death.forEach(ondeath_function => {
                    ondeath_function();
                });
            }
        }
    }

    for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
        TableElem = document.getElementById(`p${playerIdx+1}Table`)
        TableElem.innerHTML = ""
        for (let cardIdx = 0; cardIdx < table[playerIdx].length; cardIdx++) {
            value = table[playerIdx][cardIdx]
            TableElem.innerHTML += `<div class="playCard" style="z-index: ${cardIdx+1};${(selected[0] == `table.${playerIdx}.${cardIdx}` || selected[0] == `ID.${table[playerIdx][cardIdx].id}`) && playerIdx == +player?"background-color: rgb(100, 255, 100)":""}" onclick="selectCardbySelector('table.${playerIdx}.${cardIdx}')">
                                        <div class="inner-row">
                                            <div class="description">${value.card.description}</div>
                                        </div>
                                        <div class="inner-row">
                                            <div class="atkdisplay">
                                                ${value.atk}
                                            </div>
                                            <div class="manadisplay">
                                                ${value.card.mana_cost}
                                            </div>
                                            <div class="defdisplay">
                                                ${value.hp}
                                            </div>
                                        </div>
                                    </div>`
        }
        
    }
}

function overdraw(){
        index = exclusiveRandRange(0, decks[+player].length);
        decks[+player].splice(index, 1);
        updateHands();
        updateDecks();
        return;
}

function fatigue(){
    heroes[selected_heroes[+player]].fatigue+=1;
    heroes[selected_heroes[+player]].hp -= heroes[selected_heroes[+player]].fatigue;
    console.log(heroes[selected_heroes[+player]].hp)
    updateAll();
    return;
}

function pullCard(){
    if (decks[+player].length == 0) {
        return fatigue()
    }
    if (hands[+player].length >= max_hand[+player]) {
        return overdraw()
    }
    index = exclusiveRandRange(0, decks[+player].length);
    value = decks[+player][index];
    decks[+player].splice(index, 1);
    hands[+player].push(value);
    updateHands();
    updateDecks()
    return;
}

function mustPullCard(targetPlayer){
    if (decks[+targetPlayer].length == 0) {
        return fatigue()
    }
    if (hands[+targetPlayer].length >= max_hand[+targetPlayer]) {
        return overdraw()
    }
    index = exclusiveRandRange(0, decks[+targetPlayer].length);
    value = decks[+targetPlayer][index];
    decks[+targetPlayer].splice(index, 1);
    hands[+targetPlayer].push(value);
    updateHands();
    updateDecks();
    return;
}

function DrawSpell(current_player=player){
    tempDrawS = []
    for (let index = 0; index < decks[+current_player].length; index++) {
        const element = decks[+current_player][index];
        if (card_types[element].is_spell) {
            tempDrawS.push(index)
        }
    }
    rIdx = exclusiveRandRange(0, tempDrawS.length)
    cardType = decks[+current_player][tempDrawS[rIdx]]
    decks.splice(tempDrawS[rIdx], 1)
    hands[+current_player].push(cardType);
    updateHands();
    updateDecks();
    return 
    
}

function GetRandomEnemySelector(){
    if (table[+!player].length != 0) {
        return `table.${+!player}.${exclusiveRandRange(0, table[+!player].length)}`
    }
    return `table.${+!player}.0`;
}

function GetRandomFriendlySelector(){
    if (table[+player].length != 0) {
        return `table.${+player}.${exclusiveRandRange(0, table[+player].length)}`
    }
    return `table.${+player}.0`;
}

function GetRandomSelector(){
    tPlay = exclusiveRandRange(0, 2)
    if (table[tPlay].length == 0) {
        tPlay = +!tPlay
    }
    if (table[tPlay].length == 0) {
        return "table.0.0"
    }
    return `table.${tPlay}.${exclusiveRandRange(0, table[tPlay].length)}`
}

function HeroSelect(player, hero){
    selected_heroes[player] = hero
}

function RunOnSpells(){
    for (let OnSpellsPIdx = 0; OnSpellsPIdx < 2; OnSpellsPIdx++) {
        for (let OnSpellsCIdx = 0; OnSpellsCIdx < table[OnSpellsPIdx].length; OnSpellsCIdx++) {
            table[OnSpellsPIdx][OnSpellsCIdx].forEach(OnSpellFunction => {
                OnSpellFunction();
            });
        }
        
    }
}

function shuffleArray(arr){
    return [...arr].sort((a,b)=>0.5-Math.random())
}

function exclusiveRandRange(a, b){
    return Math.floor(Math.random()*(b-a)+a)
}

function randChoices(array, n1){
   tempRCh = [];
for (let n = 0; n < n1; n++){
   tempRCh.push(array[exclusiveRandRange(0, array.length)]);
}
   return tempRCh;
}
function start_game(){
    if (selected_heroes[0] == selected_heroes[1]){
        console.log("cannot pick", selected_heroes[0], "and", selected_heroes[1])
        return;
    }
    heroSelectObj = document.querySelector("body #heroSelect");
    rotateObj = document.querySelector("body #rotation");
    playerTurnObj = document.querySelector("body #rotation .center_row :first-child");
    playerTurnObj.innerText = `Player ${+player+1}'s turn!`;
    heroSelectObj.style.display = "none";
    rotateObj.style.display = "unset";
    current_scene = 2
    for (let index = 0; index < selected_heroes.length; index++) {
        console.log("---------------", index)
        SelectedHero = +document.querySelector(`body #heroSelect .row:nth-child(${index+1}) select`).value;
        selected_heroes[index] = SelectedHero;
        decks[index] = shuffleArray(starter_decks[SelectedHero])
    }
    for (let index = 0; index < 3; index++) {
        mustPullCard(0)
        mustPullCard(1)
    }
    mustPullCard(1)
    setHero()
}

function end_game(){
    document.querySelector("body #heroSelect").style.display = "none";
    document.querySelector("body #game").style.display = "none";
    document.querySelector("body #rotation").style.display = "none";
    gameOverObj = document.querySelector("body #gameOver");
    if (heroes[selected_heroes[+player]].hp <= 0) {
        if (heroes[selected_heroes[+!player]].hp <= 0) {
            gameOverObj.innerHTML = `<div class="center_row">
        <div>Game Over!</div>
        <div>Draw!</div>
        </div>`
        }
        else{
            gameOverObj.innerHTML = `<div class="center_row">
        <div>Game Over!</div>
        <div>Winner: Player ${!player+1}</div>
        </div>`
        }
    }
    else if (heroes[selected_heroes[+!player]].hp <= 0){
        gameOverObj.innerHTML = `<div class="center_row">
        <div>Game Over!</div>
        <div>Winner: Player ${player+1}</div>
        </div>`
        
    }
    else{
        gameOverObj.innerHTML = `<div class="center_row">
        <div>No idea how you got here...</div>
        <div>I guess it's cool tho.</div>
        </div>`
    }
    gameOverObj.style.display = "unset";
}

function end_turn(){
    gameObj = document.querySelector("body #game");
    rotateObj = document.querySelector("body #rotation");
    playerTurnObj = document.querySelector("body #rotation .center_row :first-child");
    gameObj.style.display = "none";
    rotateObj.style.display = "unset";
    player = !player;
    playerTurnObj.innerText = `Player ${+player+1}'s turn!`;
    current_scene = 2;
    selected = [null, null];
}

function start_turn(){
    gameObj = document.querySelector("body #game");
    rotateObj = document.querySelector("body #rotation");
    gameObj.style.display = "unset";
    rotateObj.style.display = "none";
    current_scene = 1
    may_pull = true;
    pullCard();
    AddMana();
    resetSleep();
    updateAll();
}

function resetSleep(){
    for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
        for (let cardIdx = 0; cardIdx < table[playerIdx].length; cardIdx++) {
            table[playerIdx][cardIdx].may_attack = true;
            
        }
        heroes[selected_heroes[playerIdx]].may_attack = true;
    }
}

function generateDeck(nArr, legendArr){
    return nArr.concat(nArr).concat(legendArr)
}

function RemoveNulls(){
    t = []
    for (let pIdx = 0; pIdx < 2; pIdx++) {
        for (let handIdx = 0; handIdx < hands[pIdx]; handIdx++) {
            if (hands[pIdx][handIdx] != null) {
                t.push(hands[pIdx][handIdx])
            }
        }
        hands[pIdx] = t;
    }
}


()=>{
    DamageObjects({"thisID": card.id})
}

let may_pull = true;
let current_scene = 3 // 1: currently playing, 2: currently rotating, 3: hero selection (default), 4: game over
let mana_cap = 10
let max_mana = [0, 0]
let current_mana = [0, 0]
let player = false
let max_id = 0;
let id_dict = {};
let spell_bonus = 0;
let next_spell = [0, 0]
let last_herop = [0, 0]
let card_types = [
 /*nullcard */   
       new Card(atk=0,def=0,mana_cost=mana_cap+1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //0
    new Card(atk=0,def=0,mana_cost=1,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 3);}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 3 damage to a random enemy minion."), //1
    new Card(atk=0,def=0,mana_cost=1,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 2);DamageAnything(tempOnPlay, 2)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 2 damage to a random enemy minion twice."), //2
    new Card(atk=2,def=2,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //3
    new Card(atk=0,def=0,mana_cost=2,on_play=[()=>{ShuffleToDeck(4);tempOnPlay=GetRandomSelector();DamageAnything(tempOnPlay, 2)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deals 2 damage to a random minion and put a copy of this card into your deck."), //4
    new Card(atk=2,def=2,mana_cost=2,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 2)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Deal 2 damage to a random enemy minion."), //5
    new Card(atk=2,def=3,mana_cost=2,on_play=[()=>{DrawSpell()}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Draw a spell."), //6
    new Card(atk=0,def=0,mana_cost=2,on_play=[()=>{DamageAnything(`hero.${+player}`, -5)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Heal your hero 5 hp."), //7
    new Card(atk=0,def=0,mana_cost=7,on_play=[()=>{DamageAnything(`table.${+!player}`, 5)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 5 damage to all enemy minions."), //8
    new Card(atk=8,def=8,mana_cost=8,on_play=[()=>{if (last_herop[+player] >= 10){DamageAnything(`table.${+!player}`, 10)}}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="If you dealt 10 damage with your hero power, deal 10 damage to all enemys."), // Legendary //9
    new Card(atk=5,def=7,mana_cost=7,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[()=>{if (+player == (selected_heroes[0]==0?0:1)){ShuffleToDeck(11)}}], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="If you cast a spell add a '4 mana, deal 6 damage' card to your hand."), //10
    new Card(atk=0,def=0,mana_cost=4,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 6)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 6 damage to a random enemy minion."), //11
    new Card(atk=0,def=0,mana_cost=10,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 10)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 10 damage to a random enemy minion."), //12
    new Card(atk=4,def=5,mana_cost=6,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //13
    new Card(atk=0,def=0,mana_cost=4,on_play=[()=>{tempOnPlay=GetRandomSelector();TransformMinion(tempOnPlay, 101)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Transform a minion into a 1/1 sheep."), //14
    new Card(atk=3,def=6,mana_cost=4,on_play=[()=>{DestroyCard(`random.table.${+!player}`)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Destroy a random enemy minion."), //15
    new Card(atk=3,def=5,mana_cost=4,on_play=[()=>{DamageAnything(`table.${+!player}`, 3)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Deal 3 damage to all enemy minions."), //16
    new Card(atk=0,def=0,mana_cost=1,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 2)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 2 damage to a random enemy minion."), //17
    new Card(atk=0,def=0,mana_cost=1,on_play=[()=>{tempOnPlayCard=GetCardBySelector(GetRandomSelector());if (typeof tempOnPlayCard == typeof card_types[0]){try {tempOnPlayCard.hp=1} catch (error) {}}}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Set a random minion's health to 1."), //18
    new Card(atk=1,def=1,mana_cost=1,on_play=[()=>{SummonMinion(19)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Summon a copy of this on the board."), //19
    new Card(atk=0,def=0,mana_cost=3,on_play=[()=>{DestroyCard(`random.table.${+!player}`)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Destroy a random enemy minion."), //20
    new Card(atk=2,def=4,mana_cost=7,on_play=[()=>{SummonMinion(23)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Summon an 8/8 with Charge."), //21
    new Card(atk=3,def=4,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //22
    new Card(atk=8,def=8,mana_cost=8,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=true, is_spell=false, is_protected=false, description="Charge"), //23
    new Card(atk=5,def=5,mana_cost=8,on_play=[()=>{tempOnPlay=randChoices([...Array(hands[+player].length).keys()], 3);for(let i = 0; i<3; i++){SummonMinion(hands[+player][tempOnPlay[i]])}for(let i = 0; i<3; i++){hands[+player][tempOnPlay[i]]=null};RemoveNulls();}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Summon 3 minions from your hand."), //24
    new Card(atk=0,def=0,mana_cost=10,on_play=[()=>{SummonMinion(103);SummonMinion(103);SummonMinion(103);SummonMinion(103)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Summon four 3/5 minions with Charge."), //25
    new Card(atk=0,def=0,mana_cost=7,on_play=[()=>{mustPullCard(player);mustPullCard(player);MustPlaceLastHand();MustPlaceLastHand()}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Summon two minions from your deck."), //26
    new Card(atk=0,def=0,mana_cost=4,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 6)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 6 damage to an enemy minion."), //27
    new Card(atk=3,def=3,mana_cost=4,on_play=[], on_turnend=[], on_death=[()=>{SummonMinion(101)}], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Summon two 1/1 minions on death."), //28
    new Card(atk=0,def=0,mana_cost=3,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 3);tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 3)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deals 3 damage to two random enemy minions."), //29
    new Card(atk=0,def=0,mana_cost=4,on_play=[()=>{tempOnPlay=GetRandomEnemySelector();DamageAnything(tempOnPlay, 4)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 4 damage to a minion"), //30
    new Card(atk=1,def=2,mana_cost=3,on_play=[], on_turnend=[], on_death=[()=>{SummonMinion(104)}], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Summon a 4/4 minion."), //31
    new Card(atk=2,def=5,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //32
    new Card(atk=0,def=0,mana_cost=1,on_play=[()=>{tempOnPlay=GetRandomFriendlySelector();BuffCard(tempOnPlay, "1 1");SummonMinion(102);ShuffleToDeck(102)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Gives a minion +1/+1, summon a 1/1 minion and give a '1 mana 1/1' minion into your hand"), //33
    //Paladin
    new Card(atk=1,def=1,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=true, description=""), //34
    new Card(atk=1,def=1,mana_cost=1,on_play=[()=>{pullCard()}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Draw a card."), //35
    new Card(atk=0,def=0,mana_cost=1,on_play=[()=>{DamageAnything(GetRandomFriendlySelector(), -2)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Heal 2 to a friendly minion."), //36
    new Card(atk=0,def=0,mana_cost=2,on_play=[()=>{table.forEach(tempTableContainer => {tempTableContainer.forEach(tempOnPlayCard => {tempOnPlayCard.hp = 1})})}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Set all minions health to 1."), //37
    new Card(atk=2,def=3,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //38
    new Card(atk=3,def=3,mana_cost=3,on_play=[], on_turnend=[], on_death=[()=>{BuffCard(GetRandomFriendlySelector(), "3 3")}], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Deathrattle: Give a friendly minion +3/+3"), //39
    new Card(atk=0,def=0,mana_cost=4,on_play=[()=>{BuffCard(GetRandomFriendlySelector(), "4 4")}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Give a friendly minion +4/+4."), //40
    new Card(atk=0,def=0,mana_cost=4,on_play=[()=>{SummonMinion(101);SummonMinion(101);SummonMinion(101);SummonMinion(101);SummonMinion(101)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Summon five 1/1 minion."), //41
    new Card(atk=5,def=5,mana_cost=5,on_play=[()=>{if (table[+player].length == 1) {SummonMinion(42)}}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Summon another 5/5 if you dont have any other minions."), //42
    new Card(atk=8,def=8,mana_cost=8,on_play=[()=>{SummonMinion(42)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Summon a 5/5 minion."), //43
    new Card(atk=5,def=5,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //44
    new Card(atk=0,def=0,mana_cost=3,on_play=[()=>{SummonMinion(101);SummonMinion(101);for (let onPlayI = 0; onPlayI < table[+player].length; onPlayI++){BuffCard(`table.${+player}.${onPlayI}`, "1 1")}}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Summon two 1/1 minions and than give your minions +1/+1 (including this one)."), //45
    new Card(atk=3,def=3,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //46
    new Card(atk=2,def=5,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //47
    new Card(atk=4,def=4,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt."), //48
    //Death Knight
    new Card(atk=3,def=5,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt. Add this to your hand, but it costs health instead."), //49
    new Card(atk=7,def=7,mana_cost=7,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="For the rest of the game, deal 3 damage to the opponent at the end of your turns."), //50
    new Card(atk=5,def=5,mana_cost=8,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Destroy all other minions."), //51
    new Card(atk=5,def=2,mana_cost=6,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Lifesteal. Can only take 1 damage at a time. Damage taken damages your hero instead."), //52
    new Card(atk=0,def=0,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Lifesteal. Deal 6 damage to a minion. "), //53
    new Card(atk=1,def=2,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Deal 2 damage to an enemy and your hero."), //54
    new Card(atk=0,def=0,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 3 damage to a minion."), //55
    new Card(atk=0,def=0,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Give your minions +1 attack. If you can spend 5 corpses, give +3 attack instead."), //56
    new Card(atk=0,def=0,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Gain 4 corpses, shuffle four '2 mana 2/2' minions into your deck."), //57
    new Card(atk=3,def=3,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt. If you can spend 3 corpses, summon 3/3 with Taunt."), //58
    new Card(atk=3,def=3,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Give all enemy minions Deathrattle: Summon a 2/2 with Taunt for your opponent."), //59
    new Card(atk=1,def=2,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Give a friendly minion +2 attack."), //60
    new Card(atk=4,def=6,mana_cost=7,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Destroy a random minion from your opponents hand, deck and board."), //61
    new Card(atk=2,def=2,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="spend one corpse to gain +1/+2"), //62
    new Card(atk=0,def=0,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Destroy a minion and your hero takes damage equal to its health."), //63
    new Card(atk=0,def=0,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Give ur hero +5 health. Spend 3 corpses to gain 5 more and draw a card."), //64
    new Card(atk=0,def=0,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Draw a card. Spend two corpses to draw another."), //65
    //Warlock
    new Card(atk=3,def=2,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Deal 3 damage to your hero."), //66
    new Card(atk=0,def=0,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Destroy a friendly minion and deal 2 damage to all enemy minions."), //67
    new Card(atk=0,def=0,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Destroy an enemy minion, and restore 3 health to your hero."), //68
    new Card(atk=0,def=0,mana_cost=8,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Destroy all minions."), //69
    new Card(atk=0,def=0,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Draw 3 cards and deal 3 damage to your hero."), //70
    new Card(atk=3,def=4,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Shuffle two soul fragments into your deck. Draw a card."), //71
    new Card(atk=1,def=5,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt"), //72
    new Card(atk=6,def=4,mana_cost=6,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt. Deathrattle: Summon two 3/2 minions to your board."), //73
    new Card(atk=5,def=5,mana_cost=7,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="For each soul fragment in your deck summon a 3/3 minion with Charge."), //74
    new Card(atk=0,def=0,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 3 damage to a minion shuffle two soul fragments into your deck"), //75
    new Card(atk=0,def=0,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 2 damage to all minions, shuffle two soul fragments into your deck."), //76
    new Card(atk=1,def=3,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Shuffle two soul fragments into your deck."), //77
    new Card(atk=4,def=4,mana_cost=7,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Increase your max hand size to 12. Draw 4 cards."), //78
    new Card(atk=1,def=1,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Summon a copy of this."), //79
    new Card(atk=3,def=9,mana_cost=9,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt. Summon 3 1/3 minions with Taunt."), //80
    new Card(atk=8,def=6,mana_cost=6,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Restore 5 mana, if you have 9 cards in your hand."), //81
    //Priest
    new Card(atk=0,def=0,mana_cost=0,on_play=[()=>{DamageAnything(`table.${+player}`, -4);DamageAnything(`table.${+!player}`, -4)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Heal 4 health to all minions."), //82
    new Card(atk=0,def=0,mana_cost=5,on_play=[()=>{for (let onPlayI = 0; onPlayI < table[+!player].length; onPlayI++){table[+!player][onPlayI].atk = 1}}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Set attack of all enemy minions to 1."), //83
    new Card(atk=0,def=0,mana_cost=1,on_play=[()=>{DamageAnything(GetRandomSelector(), 3)}], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Deal 3 damage to a minion."), //84
    new Card(atk=0,def=0,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Copy a card from opponents hand."), //85
    new Card(atk=0,def=0,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Copy two cards from your opponents deck add it to your hand"), //86
    new Card(atk=0,def=0,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Summon a copy of a friendly minion with 5/5 stats"), //87
    new Card(atk=0,def=0,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Give a minion +1/+2 then copy the minion"), //88
    new Card(atk=4,def=6,mana_cost=7,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Shuffle a copy of your opponents deck into your deck"), //89
    new Card(atk=0,def=0,mana_cost=9,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Summon a 1/1 copy of minions from your deck to the board until its full"), //90
    new Card(atk=2,def=6,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Deathrattle: Destroy a random enemy minion"), //91
    new Card(atk=5,def=4,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="After you cast a spell, deal 4 dmg to both heroes"), //92
    new Card(atk=0,def=0,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Put a copy of an enemy minion on your board from the enemy's deck"), //93
    new Card(atk=5,def=5,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="At the end of your turn, Restore 5 health to a damaged friendly minion"), //94
    new Card(atk=2,def=3,mana_cost=2,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Give +0/+2 to a friendly minion"), //95
    new Card(atk=4,def=3,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Deathrattle: Deal 3 dmg to enemy hero"), //96
    new Card(atk=6,def=6,mana_cost=6,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="Deathrattle: Restore 8 health to all friendly characters"), //97
    new Card(atk=0,def=3,mana_cost=6,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="At the end of your turn, draw 3 cards, until your hand is full."), //98
    new Card(atk=0,def=3,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="At the end of your turn, summon a minion from your hand."), //99
    new Card(atk=0,def=3,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description="After you cast 3 spells in a turn, summon a 5/5 Dragon"), //100
    new Card(atk=1,def=1,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //101
    new Card(atk=3,def=5,mana_cost=0,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt. Battlecry: Take 5 health from hero. Deathrattle: Return this to your hand"), //102
    new Card(atk=3,def=5,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=true, is_spell=false, is_protected=false, description="Charge"), //103
    new Card(atk=4,def=4,mana_cost=4,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //104
    new Card(atk=3,def=3,mana_cost=3,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt. Deathrattle: Summon a 1/1 minion"), //105
    new Card(atk=2,def=2,mana_cost=0,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //106
    new Card(atk=0,def=0,mana_cost=0,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=true, is_protected=false, description="Heal 2 health to your hero"), //107
    new Card(atk=1,def=3,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Taunt"), //108
    new Card(atk=5,def=5,mana_cost=5,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""), //109
    new Card(atk=1,def=1,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=true, is_spell=false, is_protected=false, description="Charge"), //110
    new Card(atk=0,def=10,mana_cost=10,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=true, instant_atk=false, is_spell=false, is_protected=false, description="Annoying look.") //111






    
    
    //minta
    // new Card(atk=0,def=0,mana_cost=1,on_play=[], on_turnend=[], on_death=[], on_attack=[], on_spell=[], on_damage=[], is_taunt=false, instant_atk=false, is_spell=false, is_protected=false, description=""),



];
allow_table = true;
let heroes = [
    new Hero(hero_power=(target)=>{if (DamageAnything(target, heroes[0].hp_buff+1)) {heroes[0].hp_buff+=1;last_herop[+player]=heroes[0].hp_buff;return true}return false;}, "Deal 1 (+buff) damage to anything."), //Mage
    new Hero(hero_power=()=>{DamageAnything(`hero.${+!player}`, 2)}, "Deal 2 dmg to enemy hero."), //Hunter
    new Hero(hero_power=()=>{SummonMinion(101)}, hp_description="Summons a 1/1 minion"), //Paladin
    new Hero(), //Death Knight
    new Hero(), //Warlock
    new Hero(), //Priest
    new Hero(hero_power=()=>{for(let oPIdx=0;oPIdx<2;oPIdx++){for (let onPlayI = 0; onPlayI < table[oPIdx].length; onPlayI++){if(table[oPIdx][onPlayI].card_idx!=111){table[oPIdx][onPlayI]=new PlacedCard(111)}}}}, hp_description="Spreads his Norbiness to all other minions, transforming them into a Norbi's")  //norbi Xd
]
let table = [[], []]
let hands = [[], []]
let decks = [[], []]
let weapons = [0, 0]
let max_hand = [10, 10]
let max_table = 7
let starter_decks = [
    generateDeck([1,2,3,4,5,6,7,8,11,12,13,14,15,16], [9,10,99]),
    generateDeck([17,18,19,20,25,26,27,28,29,30,31,32,33], [21,22,23,24]),
    generateDeck([34,35,36,37,38,40,41,42,43,44,45,46,47], [39,48]),
    generateDeck([51,52,53,54,55,56,57,58,60,62,63,64,65], [49,50,59,61]),
    generateDeck([66,67,68,69,70,71,72,73,75,76,77,79,80], [74,78,81,99]),
    generateDeck([82,83,84,85,86,87,88,91,92,93,94,95,96,97], [89,90,100]),
]
let selected = [null, null] // SelectedID, TargetID
let selected_heroes = [1, 0]

function AddMana() {
    if (max_mana[+player] < mana_cap){
        max_mana[+player]++
    }
    current_mana[+player] = max_mana[+player]
    updateMana();
}

class PlacedCard{
    constructor(card_idx) {
        this.id = ++max_id;
        var passed = true;
        do {
            passed = true;
            for (value of Object.values(id_dict)){
                if (value.id == this.id) {
                    ++this.id;
                    passed = false;
                }
            }
        } while (!passed);
        id_dict[this.id] = this;
        this.card_idx = card_idx;
        this.card = this.get_card_type()
        // console.log(this.card, this.card_idx)
        this.hp = this.card.def
        this.atk = this.card.atk
        this.may_attack = this.card.instant_atk
    }

    get_card_type() {
        return card_types[this.card_idx];
    }
}



// player1 starts with 3 cards, player2 starts with 4

new PlacedCard(0)
