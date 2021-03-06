import React, { useEffect, useState, useRef } from "react";
import { Link, Redirect } from "react-router-dom";

import { StoryItem, useHeadline, StoriesType } from "../interface/items";
import { Loading, UserIcon } from "../component/misc";
import { tsPropertySignature } from "@babel/types";
import { NONAME } from "dns";
import { LoadState } from "../interface/enums";
import { HNHeadline, HNHeadlineMeta } from "../component/sections";
import { useStories } from "./hooks";

export function HNStoryCard(props: {
  hn_id: Number;
  load_state: LoadState;
  on_complete: () => void;
  ref?: any;
}) {
  const headline = useHeadline({
    hn_id: props.hn_id,
    component_state: props.on_complete,
  });
  const [redirect, setRedirect] = useState(false); //Redirect to comments page

  let story_meta =
    headline && headline.by ? (
      <HNHeadlineMeta
        id={headline.id}
        by={headline.by}
        descendants={headline.descendants}
      ></HNHeadlineMeta>
    ) : undefined;

  let headlineElement =
    headline && headline.by ? (
      <HNHeadline
        title={headline.title}
        url={headline.url}
        setRedirect={setRedirect}
      ></HNHeadline>
    ) : undefined;

  return props.load_state == LoadState.InProcess ? null : redirect ? (
    <Redirect push to={`/item/${headline.id}`}></Redirect>
  ) : (
    <li className="list-group-item my-1 border border-orange-color shadow-all rounded v-base bg-orange-200">
      <div className="flex items-center">
        <div className="mw3 mh1 text-center v-base">
          <span className="db f6 text-orange-700">{headline.score}</span>
          <span className="db f6 text-orange-600">points</span>
        </div>
        <div>
          <div className="my-1 ml-2 fw5 ">{headlineElement}</div>
          {story_meta}
        </div>
      </div>
    </li>
  );
}

const News: React.FC = (props: any) => {
  //const [hn_ids, set_hn_ids]: [Array<number>, any] = useState([]);
  const [load_state, set_loading]: [LoadState, any] = useState(
    LoadState.InProcess
  );
  //const [max_items, set_max_items]: [number, any] = useState(0);
  const ref_load_state = useRef(1);
  const ref_load_elem = useRef();
  let is_mounted = true;

  const location: string = props.match.url.slice(1);

  const [hn_ids, error] = useStories(StoriesType[location]);

  let max_items: number = 0;
  if (hn_ids) {
    max_items = 100 > hn_ids.length ? hn_ids.length : 100;
  }

  useEffect(() => {
    if (ref_load_elem.current) {
      let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          console.log(entry);
        });
      });
      observer.observe(ref_load_elem.current!);

      return observer.disconnect;
    }
  }, [ref_load_elem]);

  function on_complete(): void {
    ++ref_load_state.current;
    let state;
    if (ref_load_state.current < (max_items * 3) / 4) {
      state = LoadState.InProcess;
    } else {
      state = LoadState.Complete;
    }
    if (state != load_state) {
      set_loading(state);
    }
  }

  const items = hn_ids
    ? hn_ids
        .slice(0, max_items)
        .map((num: number) => (
          <HNStoryCard
            hn_id={num}
            key={num}
            load_state={load_state}
            on_complete={on_complete}
          ></HNStoryCard>
        ))
    : null;

  if (items && items[items.length - 1]) {
    let hn_id = hn_ids[max_items - 1];
    items[items.length - 1] = (
      <HNStoryCard
        hn_id={hn_id}
        key={hn_id}
        ref={ref_load_elem}
        load_state={load_state}
        on_complete={on_complete}
      ></HNStoryCard>
    );
  }

  return (
    <div className="">
      {[
        <ul className="list-group"> {items} </ul>,
        //@ts-ignore
        load_state == LoadState.InProcess ? <Loading></Loading> : null,
      ]}
    </div>
  );
};

export { News };
