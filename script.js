const rootDiv = document.querySelector(".root");
const search = document.querySelector(".search")

function addData(pokemon_name, pokemon_ability, poke_base, he, mo, src, id) {
    const card = document.createElement("div");

    card.setAttribute("class", "card");

    let poke_img = document.createElement("img");
    poke_img.setAttribute("src", src);

    let poke_name = document.createElement("h2");
    poke_name.innerText = "Name: " + pokemon_name;

    let poke_ability = document.createElement("h2");
    poke_ability.innerText = "Ability: " + pokemon_ability;

    let poke_base_exp = document.createElement("h2");
    poke_base_exp.innerText = "Base Experience: " + poke_base;

    let height = document.createElement("h2");
    height.innerText = "Height: " + he;

    let moves = document.createElement("h2");
    moves.innerText = "Move: " + mo;

    let pid = document.createElement("h2");
    pid.innerText = "Id: " + id;

    card.append(poke_img);
    card.append(poke_name);
    card.append(pid);

    card.append(poke_ability);
    card.append(poke_base_exp);
    card.append(height);
    card.append(moves);

    rootDiv.append(card);
}

let poke_names;
let poke_abilities;
let poke_base_experience;
let height;
let moves;
let img_src;
let id;

// console.log(axios)
let offset = 1;
let limit = 20;

for (let i = offset; i <= limit; i++) {
    axios
        .get(`https://pokeapi.co/api/v2/pokemon/${i}`)
        .then(({ data }) => {
            poke_names = data.name;
            poke_id = data.id;
            poke_abilities = data.abilities[0].ability.name;
            poke_base_experience = data.base_experience;
            height = data.height;
            moves = data.moves[0].move.name;
            img_src = data.sprites.other.home.front_default;

            //  creatingand selecting Elements:

            addData(
                poke_names,
                poke_abilities,
                poke_base_experience,
                height,
                moves,
                img_src,
                poke_id
            );
        })
        .catch((err) => console.log(err));
}

// console.log(offset)
// console.log(limit)

let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

prev.disabled = "true";

async function getData(offset, limit) {
    for (let i = offset; i <= limit; i++) {
        const pokemons = axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        pokemons.then((data) => {
            const pokemons = data.data;
            // console.log(pokemons.name)
            addData(
                pokemons.name,
                pokemons.abilities[0].ability.name,
                pokemons.base_experience,
                pokemons.height,
                pokemons.moves[0].move.name,
                pokemons.sprites.other.home.front_default,
                pokemons.id
            );
        });
    }
}

next.addEventListener("click", (e) => {
    rootDiv.innerHTML = "";
    offset = offset + 20;
    limit = limit + 20;

    getData(offset, limit);
    prev.disabled = false;
});

prev.addEventListener("click", (e) => {
    // console.log("previous button working")
    rootDiv.innerHTML = "";

    offset = offset - 20;
    limit = limit - 20;
    if (offset <= 1) {
        prev.disabled = true;
    }

    getData(offset, limit);
    console.log(offset);
    console.log(limit);
});

// Search

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.elements.search.value == "") {
        console.log("clicked")

    } else {
        next.remove();
        prev.remove();

        rootDiv.innerHTML = "";

        const query = e.target.elements.search.value;
        e.target.elements.search.value = "";
        let url = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;
        console.log(url);
        axios
            .get(url)
            .then((data) => {
                const pokemons = data.data;
                // console.log(pokemons);
                addData(
                    pokemons.name,
                    pokemons.abilities[0].ability.name,
                    pokemons.base_experience,
                    pokemons.height,
                    pokemons.moves[0].move.name,
                    pokemons.sprites.other.home.front_default,
                    pokemons.id
                );
            })
            .catch((err) => {
                rootDiv.innerHTML = `<h2>Not found </h2>
                `
            });

        const buttons = document.querySelector(".buttons");
        const a = document.createElement("a");
        a.innerText = "Back";
        a.setAttribute("href", "index.html");

        const back = document.createElement("button");
        back.setAttribute("class", "btn-group")
        back.append(a);
        buttons.append(back);
    }
});