/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "react-query"
import axios from "axios"
import useLocalStorage from "use-local-storage"
import { useObserver } from "../lib/hooks/useObserver"
import PokemonCard from "../components/PokemonCard"
import style from "../styles/index.module.scss"

const OFFSET = 40

const getPokemonList = ({ pageParam = OFFSET }) =>
	axios
		.get("https://pokeapi.co/api/v2/pokemon", {
			params: {
				limit: OFFSET,
				offset: pageParam,
			},
		})
		.then(res => res?.data)

const Index = () => {
	const bottom = useRef(null)
	const [scrollY] = useLocalStorage("poke_list_scroll", 0)

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery("pokemonList", getPokemonList, {
		getNextPageParam: lastPage => {
			const { next } = lastPage
			if (!next) return false

			const offset = new URL(next).searchParams.get("offset")
			return Number(offset)
		},
	})

	const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage()

	useObserver({
		ref: true,
		target: bottom,
		onIntersect,
	})

	useEffect(() => {
		if (scrollY !== "0") window.scrollTo(0, Number(scrollY))
	}, [])

	return (
		<div className={style.pokemons_wrap}>
			{status === "loading" && <p>불러오는 중</p>}

			{status === "error" && <p>{error.message}</p>}

			{status === "success" && (
				<div className={style.pokemon_list_box}>
					{data.pages.map((group, index) => (
						<div className={style.pokemon_list} key={index}>
							{group.results.map(pokemon => {
								const { name, url } = pokemon
								const id = url.split("/")[6]

								return <PokemonCard key={name} id={id} name={name} />
							})}
						</div>
					))}
				</div>
			)}

			<div ref={bottom} />

			{isFetchingNextPage && <p>계속 불러오는 중</p>}
		</div>
	)
}

export default Index
