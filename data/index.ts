import axios from "axios";
import path from "path";
import fs from "fs";

const GET_POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_IMG_URL = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";
const POKEMONS_PATH = path.join(__dirname, "pokemons.json");
const POKEMONS_AMOUNT = 151;

writePokemons();

async function writePokemons(): Promise<void> {
	const pokemons = await getAllPokemons();
	fs.writeFileSync(POKEMONS_PATH, JSON.stringify(pokemons));
}

async function getAllPokemons(): Promise<PokemonData[]> {
	const pokemons: PokemonData[] = [];
	for (let i = 1; i <= POKEMONS_AMOUNT; i++) {
		pokemons.push(await getPokemon(i));
	}
	return pokemons;
}

async function getPokemon(id: number): Promise<PokemonData> {
	const pokemon = await axios.get(GET_POKEMON_URL + id).then((res) => res.data);
	const pokemonSpecs = {
		types: pokemon.types.map((type) => type.type.name),
		height: pokemon.height / 10,
		weight: pokemon.weight / 10,
	};
	const pokemonData = {
		name: pokemon.species.name,
		id: pokemon.id,
		img: `${POKEMON_IMG_URL + "0".repeat(3 - String(id).length) + id}.png`,
		specs: pokemonSpecs,
	};
	return pokemonData;
}

interface PokemonData {
	name: string;
	id: number;
	img: string;
	specs: PokemonSpecs;
}

interface PokemonSpecs {
	types: string[];
	height: number;
	weight: number;
}
