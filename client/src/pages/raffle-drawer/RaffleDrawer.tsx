import React, { useRef, useState, useEffect } from "react";
import TextLoop from "react-text-loop";
import { useWindowSize } from "@react-hook/window-size";
import Confetti from "react-confetti";
import { Grid, Box, Typography, Button, FormControl, InputLabel, Select, FormHelperText } from "@material-ui/core";
import { UseDelete, UseDeleteBulk } from "../../utils/UseDelete";
import { ShuffleArray } from "../../utils/ShuffleArray";
import api from "../../utils/api";
import "./slot.css";
const regionList = ["NLR", "SLR", "VIS", "NMR", "EMR", "SMR"];

export default function RaffleDrawer() {
  const ref = useRef<TextLoop>(null);
  const [state, setstate] = useState({
    interval: 0,
    isStop: false,
    wordList: [{ name: "Please Select Prize And Region" }],
    winner: {},
    prizes: [],
    prizeSelected: "",
    regionSelected: "",
  });
  const [width, height] = useWindowSize();

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof state;
    setstate({
      ...state,
      [name]: event.target.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const wordlist: any = await api.get(`entries/region/${state.regionSelected}`);

      if (wordlist.length === 0) {
        setstate({ ...state, wordList: [{ name: "empty" }] });
        return;
      }
      setstate({ ...state, wordList: wordlist });
    };
    fetchData();
  }, [state.regionSelected]);
  useEffect(() => {
    const fetchData = async () => {
      const prizes: any = await api.get("prizes");
      setstate({ ...state, prizes: prizes });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const editEntryAndAddToWinners = async (winningEntry: any) => {
      winningEntry.isValid = false;

      const winner = {
        entryID: winningEntry.id,
        prizeID: 0,
        prizeName: "",
      };

      state.prizes.forEach((element: any) => {
        if (element.name === state.prizeSelected) {
          winner.prizeID = element.id;
          winner.prizeName = element.name;
        }
      });
      winningEntry.numberOfEntries = 0;
      await api.post(`winners`, winner);
      const getwinners = UseDeleteBulk(state.wordList, "accountNumber", winningEntry.accountNumber, true);

      getwinners.forEach(async (element: any) => {
        element.isValid = false;
      });
      console.log(getwinners);

      await api.post(`entries/bulk`, getwinners);
    };

    if (state.interval >= 100) {
      const current: any = ref?.current?.state?.currentEl;
      const key = parseInt(current.key?.replace(".$", ""));
      const winner = state.wordList[key];

      editEntryAndAddToWinners(winner);

      const getLossers = UseDeleteBulk(state.wordList, "name", winner.name, false);

      setstate({
        ...state,
        wordList: getLossers,
        isStop: false,
        interval: 0,
        winner: winner,
      });

      return;
    }
    if (state.isStop) {
      setTimeout(() => {
        setstate({ ...state, interval: state.interval + 1.5 });
      }, 100);
    }
  }, [state]);

  const click = () => {
    const data: any = ShuffleArray(state.wordList);
    setstate({ ...state, wordList: data, interval: 50, isStop: true });
  };

  if (state.wordList.length === 0) return null;

  return (
    <div className="raffleDrawer">
      <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Prize</InputLabel>
            <Select
              native
              value={state.prizeSelected}
              onChange={(e: any) => handleChange(e)}
              inputProps={{
                name: "prizeSelected",
              }}
            >
              <option aria-label="None" value="" />
              {state.prizes.map((item: any, key) => (
                <option key={key} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl error={state.wordList.length === 1 && state.regionSelected !== ""}>
            <InputLabel id="demo-simple-select-label">Region</InputLabel>
            <Select
              native
              value={state.regionSelected}
              onChange={(e: any) => handleChange(e)}
              inputProps={{
                name: "regionSelected",
              }}
            >
              <option aria-label="None" value="" />
              {regionList.map((item, key) => (
                <option key={key} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            {state.wordList.length === 1 && state.regionSelected !== "" ? (
              <FormHelperText>no available Entries on this region *</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
      </Grid>

      <Box height="100%">
        <Grid container direction="row" justify="center" alignItems="center" style={{ height: "100%" }}>
          <Grid item xs={12}>
            {Object.entries(state.winner).length > 0 && !state.isStop ? (
              <>
                <Confetti numberOfPieces={1000} recycle={false} width={width} height={height} />
                <Typography variant="h5" component="h6" gutterBottom>
                  <Box textAlign="center">CONGRATULATIONS!!</Box>{" "}
                </Typography>
              </>
            ) : null}

            <TextLoop interval={state.interval} ref={ref}>
              {state.wordList.map((item: any, key) => (
                <Typography key={key} variant="h2" component="h3" gutterBottom>
                  <Box textAlign="center">{`${item.name}`}</Box>
                </Typography>
              ))}
            </TextLoop>
            <Grid item xs={12}>
              <Box textAlign="center" mt="10px">
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={() => click()}
                  disabled={state.isStop || state.wordList.length === 1 || state.prizeSelected === ""}
                >
                  Draw
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
