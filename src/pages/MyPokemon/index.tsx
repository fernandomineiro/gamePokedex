import React, { createRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Navbar, Text, Modal, PokeCard, DeleteButton } from "../../components";
import { useGlobalContext } from "../../libs/context";
import { generatePokeSummary } from "../../libs/helpers";
import { IMyPokemon } from "../../libs/types/pokemon";

import * as T from "./index.style";

const MyPokemon: React.FC = () => {
  const [pokemons, setPokemons] = useState<IMyPokemon[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string>("");
  const [navHeight, setNavHeight] = useState<number>(0);
  const { setState } = useGlobalContext();
  const navRef = createRef<HTMLDivElement>();

  async function loadMyPokemon() {
    const rawPokemons = localStorage.getItem("pokegames@myPokemon");
    const parsed = JSON.parse(rawPokemons!) || [];
    setPokemons(parsed);
  }

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight!);
    loadMyPokemon();
  }, []);

  async function releasePokemon(nickname: string) {
    const newCollection = pokemons.filter((pokemon: IMyPokemon) => pokemon.nickname !== nickname);
    localStorage.setItem("pokegames@myPokemon", JSON.stringify(newCollection));
    loadMyPokemon();
    setState({ pokeSummary: generatePokeSummary(newCollection) });
  }

  return (
    <>
      <Modal open={deleteConfirmation} overlay="light">
        <T.DeleteConfirmationModal>
          <div className="pxl-border" style={{ textAlign: "left" }}>
            <Text>Tem certeza que deseja liberar {selectedPokemon}?</Text>
            <br />
            <Text>Você terá que pegar outro e não pode desfazer esta ação</Text>
          </div>

          <div>
            <Button
              variant="light"
              onClick={() => {
                releasePokemon(selectedPokemon);
                setDeleteConfirmation(false);
              }}>
              Liberar
            </Button>
            <Button onClick={() => setDeleteConfirmation(false)}>Voltar</Button>
          </div>
        </T.DeleteConfirmationModal>
      </Modal>

      <T.Page style={{ marginBottom: navHeight }}>
        <T.Header>
          <Text as="h1" variant="darker" size="lg">
            Meu Pokemon
          </Text>
          <Text as="span" variant="darker" size="lg">
            Total: {pokemons.length}
          </Text>
        </T.Header>

        {pokemons.length ? (
          <T.Grid>
            {pokemons.length &&
              [...pokemons].reverse().map((pokemon: IMyPokemon) => (
                <T.WrapperCardList key={pokemon.nickname}>
                  <PokeCard name={pokemon.name} nickname={pokemon.nickname} sprite={pokemon.sprite}>
                    <DeleteButton
                      onClick={() => {
                        setSelectedPokemon(pokemon.nickname);
                        setDeleteConfirmation(true);
                      }}
                    />
                  </PokeCard>
                </T.WrapperCardList>
              ))}
          </T.Grid>
        ) : (
          <T.EmptyState>
            <Text>Você não tem nenhum Pokemon</Text>
            <Link to="/pokemons">
              <Button>Explorar</Button>
            </Link>
          </T.EmptyState>
        )}
      </T.Page>

      <Navbar ref={navRef} />
    </>
  );
};

export default MyPokemon;
