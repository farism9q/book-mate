"use client";

import { Admin, Resource } from "react-admin";

import simpleRestProvider from "ra-data-simple-rest";
import { ChangelogCreate } from "./changelog/create";
import { ChangelogsList } from "./changelog/list";
import { ChangelogEdit } from "./changelog/edit";

const dataProvider = simpleRestProvider("/api");

const App = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="changelog"
        list={ChangelogsList}
        create={ChangelogCreate}
        edit={ChangelogEdit}
        recordRepresentation={"title"}
      />
    </Admin>
  );
};

export default App;
