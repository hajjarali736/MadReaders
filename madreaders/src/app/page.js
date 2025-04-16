import Image from "next/image";
import React from "react";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <>
      <h1 className="text-primary">Hello World</h1>
      <Button variant="contained" color="primary">
        MUI + Tailwind = ❤️
      </Button>
    </>
  );
}
