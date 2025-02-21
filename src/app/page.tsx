"use client";

import { useState } from "react";
import { Page1 } from "@/component/Page1";
import { Page2 } from "@/component/Page2";

export default function Home() {
  const [page, setPage] = useState(1);
  const Clicked = () => {
    setPage(page + 1);
  };
  const BackClicked = () => {
    setPage(page - 1);
  };
  return (
    <>
      {page === 1 && <Page1 Clicked={Clicked} BackClicked={BackClicked}/>}
      {page === 2 && <Page2 Clicked={Clicked} />}
    </>
  );
}
