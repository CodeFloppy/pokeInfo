const typesBt = document.getElementById('typesBt');
const listType = document.getElementById('listType');

typesBt.addEventListener('click',_=>{
    listType.classList.toggle('list-display');
});

const cardsArea = document.getElementById('cardsArea');

const arrowLeftBt = document.getElementById('arrowLeftBt');
const arrowRightBt = document.getElementById('arrowRightBt');

const pokemons = [];
const pokemonsTypes = [];
let newPokemons = [];
let showPk = [];
let dir = 0;
let cardsNum = 6;

let pkNumberArr,  pkNameArr,  pkImageArr, pkTypesArr = [];

const search = document.getElementById('search');
let searchText = [];
const related = document.getElementById('related');
let arrOfList = [];
let pkForType = [];

window.addEventListener('click',(e)=>{
    if(e.target.id !== 'search'){
        related.style.display = 'none';
    }
})
const glassView = document.getElementById('glassView');
const exitBt = document.getElementById('exitBt');
exitBt.addEventListener('click',_=>{
    glassView.style.display = 'none';
});

search.addEventListener('keydown',(e)=>{
    let pkRelated = [];
    if(e.key === 'Backspace'){
        searchText.pop();
    }else if(e.key !== 'Enter'){
        searchText.push(e.key);
    }

    pkRelated = searchCompare(searchText, pkForType);
    addRelated(pkRelated);

    if(e.key === 'Enter'){
        related.style.display = 'none';
        showPk = pkRelated;
        search.value = '';
        searchText = [];
        showCards(showPk);
        addDates(showPk);
    }else{
        arrOfList = document.getElementsByClassName('related--li');
        for(let i = 0; i < arrOfList.length; i++){
            arrOfList[i].addEventListener('click', _=>{
            showPk = [arrOfList[i].innerHTML];
            search.value = '';
            searchText = [];

            showCards(showPk);
            addDates(showPk);
            })
        }

        related.style.display = 'block';
    }
})

function addRelated(arr){
    let repead = 6;
    related.innerHTML = '';
    if(arr.length > 0){
        if(arr.length < repead) repead = arr.length;

        for(let i = 0; i < repead; i++){
            related.innerHTML += `
            <li class="related--li">${arr[i]}</li>
            `;
        }
    }
}

function strToArr(text){
    let newArr = [];
    for(let i = 0; i < text.length; i++){
        newArr.push(text[i]);
    }

    return newArr;
}

function searchCompare(searchText, arrPk){
    let textArrA = searchText;
    let newArr = [];

    for(let i = 0; i < arrPk.length; i++){
        if(arrPk[i].length >= textArrA.length){
            let textArrB = strToArr(arrPk[i]);
            
            if(arrValidate(textArrA, textArrB)){
                newArr.push(arrPk[i]);
            }
        }
    }
    return newArr;
}
function arrValidate(arrA, arrB){
    for(let i = 0; i < arrB.length; i++){
        if(arrB.length - i >= arrA.length){
            
            for(let j = 0; j < arrA.length; j++){
                if(arrB[i + j] !== arrA[j]){
                    break;
                }else if(j + 1 === arrA.length){
                    return 1;
                }
            }
        }else return 0;
    }
}

function loadPokemons(){
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
    .then(res => res.json())
    .then(res => {
        fillArray(res.results, pokemons);
        showPk = pokemons;
        pkForType = pokemons;
        dir = 0;
        showCards(showPk);
        addDates(showPk);
    })
    .catch(err => console.log(err));
}

function loadPkTypes(){
    fetch('https://pokeapi.co/api/v2/type')
    .then(res => res.json())
    .then(res => {
        fillArray(res.results, pokemonsTypes);
        pokemonsTypes.push('all');

        for(let i = 0; i < pokemonsTypes.length; i++){
            if(pokemonsTypes[i] !== 'unknown'){
                listType.innerHTML += `<li class="box-types__list--type list-type">${pokemonsTypes[i]}</li>`;
            }
        }
        const arrOflistType = document.getElementsByClassName('list-type');
        addEvent(arrOflistType);
    })
    .catch(err => console.log(err));
}

function loadNewPk(arr){
    newPokemons = [];
    for(let i = 0; i < arr.length; i++){
        newPokemons.push(arr[i].pokemon.name);
    }

    dir = 0;
    pkForType = newPokemons;
    showPk = newPokemons;
    search.value = '';
    searchText = [];
    showCards(showPk);
    addDates(showPk);
}

function addEvent(arrClass){
    for(let i = 0; i < arrClass.length; i++){
        
        arrClass[i].addEventListener('click', _=>{
            if(i === arrClass.length - 1){
                loadPokemons();
            }else{
                fetch(`https://pokeapi.co/api/v2/type/${arrClass[i]. innerHTML}`)
                .then(res => res.json())
                .then(res => {
                    loadNewPk(res.pokemon);
                })
                .catch(err => console.log(err));
            }
            document.getElementById('typeText').innerHTML = arrClass[i].innerHTML;
            listType.classList.toggle('list-display');
        });
        
    }
}

function fillArray(arr, emptyArr){
    for(let i = 0; i < arr.length; i++){
        emptyArr.push(arr[i].name);
    }
}

function addDates(arr){
    let repead = cardsNum;

    if(arr.length - dir < cardsNum){
        repead = arr.length - dir;
    }

    for(let i = dir; i < repead + dir; i++){
        fetch(`https://pokeapi.co/api/v2/pokemon/${arr[i]}`)
        .then(res => {
            if(res.ok){
                return res.json();
            }else{
                throw new Error(res.status);
            }  
        }) 
        .then(res => {
            pkNumberArr[i - dir].innerHTML = res.id;
            pkNameArr[i - dir].innerHTML = res.name;
            pkImageArr[i - dir].innerHTML = `<img src="${res.sprites.other['official-artwork'].front_default}" alt="">`;

            for(let j = 0; j < res.types.length; j++){
                pkTypesArr[i - dir].innerHTML += `<div class="card__type--img">${res.types[j].type.name}</div>`;
            }
            
        })
        .catch(err => console.log(err));
    }
}

function showCards(arr){

    let repead = cardsNum;

    if(arr.length - dir < cardsNum){
        repead = arr.length - dir;
    }

    cardsArea.innerHTML = '';
    for(let i = 0; i < repead; i++){
        cardsArea.innerHTML += `
            <div class="cards__card card">
                <div class="card__header">
                    <div class="card__header--number pokemon-number" id="cardNumber">1</div>
                    <div class="card__header--name pokemon-name" id="cardName">pokemon</div>
                </div>

                <div class="card__img pokemon-img" id="cardImg"></div>
                
                <div class="card__types pokemon-types"></div>
            </div>
        `;
    }

    pkNumberArr = document.getElementsByClassName('pokemon-number');
    pkNameArr = document.getElementsByClassName('pokemon-name');
    pkImageArr = document.getElementsByClassName('pokemon-img');
    pkTypesArr = document.getElementsByClassName('pokemon-types');

    let arrOfcard = document.getElementsByClassName('card');


    for(let i = 0; i <  arrOfcard.length; i++){
        arrOfcard[i].addEventListener('click',_=>{
            glassView.style.display = 'flex';
            addFullData(arrOfcard[i].children[0].children[1].innerHTML);
        });
    }
}

const elmEvolutions = document.getElementById('evolutions');

function addFullData(name){
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(res => res.json())
    .then(res => {

        // number, name and image
        document.getElementById('fullInfoNumber').innerHTML = `${res.id}`;
        document.getElementById('fullInfoName').innerHTML = `${name}`;
        document.getElementById('fullInfoImg').innerHTML = `<img src="${res.sprites.other['official-artwork'].front_default}" alt="">`;

        // types
        document.getElementById('fullInfoTypes').innerHTML = '';
        for(let i = 0; i < res.types.length; i++){
            document.getElementById('fullInfoTypes').innerHTML += `
            <div class="full-info-card__front--type">${res.types[i].type.name}</div>
            `;
        }

        // stats
        document.getElementById('statsTable').innerHTML = '';
        for(let i = 0; i < res.stats.length; i++){
            document.getElementById('statsTable').innerHTML += `<li class="stats__table--list">${res.stats[i].base_stat}</li>`;
        }

        // height and weight
        document.getElementById('statsOtherHeighr').innerHTML = `<p>height :${res.height}</p>`;
        document.getElementById('statsOtherWeight').innerHTML = `<p>weight :${res.weight}</p>`;

        // evolutions
        elmEvolutions.innerHTML = '';

        fetch(res.species.url)
        .then(data => data.json())
        .then(data => {
            fetch(data.evolution_chain.url)
            .then(data2 => data2.json())
            .then(data2 => {
                let evolution = data2.chain;
                
                while(1){
                    fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`)
                    .then(data3 => data3.json())
                    .then(data3 => {
                        elmEvolutions.innerHTML += `
                            <div class="evolutions__pokemon">
                                <div class="evolutions__pokemon--img">
                                    <img src="${data3.sprites.front_default}" alt="">
                                </div>
                                <div class="evolutions__pokemon--name">
                                    <p>${data3.name}</p>
                                </div>
                            </div>
                        `;
                    })
                    if(evolution.evolves_to.length > 0){
                        evolution = evolution.evolves_to[0];
                    }else{
                        break;
                    }
                }
            })
        })
    })
    .catch(err => console.log(err));
}


window.addEventListener('load',_=>{
    
    loadPokemons();
    loadPkTypes();

    arrowLeftBt.addEventListener('click',_=>{
        if(dir - cardsNum >= 0){
            dir -= cardsNum;
        }
        showCards(showPk);
        addDates(showPk);
    });
    arrowRightBt.addEventListener('click',_=>{
        if(cardsNum + dir < showPk.length){
            dir += cardsNum;
        }

        showCards(showPk);
        addDates(showPk);
    });
});