const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const pokemons = require("./data/pokemons.json");
const types = require("./data/types.json");
const tms = require("./data/tms.json");
const candies = require("./data/candies.json");
const natures = require("./data/natures.json");
const moves = require("./data/moves.json");

const buildDataPokemons = () => {
    const outputDir = path.resolve(__dirname, "./pokemon");
    fse.ensureDirSync(outputDir);
    fse.ensureDirSync(`${outputDir}/_archive`);
    const pokemonsBuilt = pokemons.map((p) => {
        const TMS =
            p.Tms?.length > 0
                ? p.Tms.map((tmKey) => {
                      return tms.find((tm) => {
                          return tm.key === tmKey;
                      });
                  })
                : null;
        const CANDIES =
            p.Candies?.length > 0
                ? p.Candies.map((candyKey) => {
                      return candies.find((candy) => {
                          return candy.key === candyKey;
                      });
                  })
                : null;
        const NATURE = p.Nature
            ? natures.find((n) => {
                  return n.key === p.Nature;
              })
            : null;
        const MOVES =
            p.Moves?.length > 0
                ? p.Moves.map((m) => {
                      const { Move: moveKey, ...rest } = m;
                      const move = moves.find((item) => {
                          return item.key === moveKey;
                      });
                      return {
                          ...(move || {}),
                          ...rest,
                      };
                  })
                : null;
        const TYPES =
            p.Types?.length > 0
                ? p.Types.map((typeKey) => {
                      return types.find((t) => {
                          return t.key === typeKey;
                      });
                  })
                : null;
        const pokemon = {
            ...p,
            tms: TMS,
            candies: CANDIES,
            nature: NATURE,
            moves: MOVES,
            types: TYPES,
            Moves: null,
            Tms: null,
            Candies: null,
            Nature: null,
            Types: null,
        };
        const keysToDelete = ["Moves", "Tms", "Candies", "Nature", "Types"];
        keysToDelete.forEach((propKey) => {
            try {
                delete pokemon[propKey];
            } catch {
                //do nothing
            }
        });
        return pokemon;
    });
    const files = pokemonsBuilt.map((p) => {
        const key = p.key;
        const dir = `${outputDir}/${key}`;
        fse.ensureDirSync(dir);
        const fileName = `data.json`;
        const filePath = path.resolve(__dirname,`${outputDir}/${fileName}`);
        fs.writeFileSync(filePath, JSON.stringify(p, null, 4));
        return {
            key,
            fileName,
            filePath,
        };
        return {
            file: {
                name: fileName,
                path: filePath,
            },
        };
    });
    return files;
};
buildDataPokemons();
