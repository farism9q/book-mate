import {
  Datagrid,
  List,
  TextField,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";

export const ChangelogsList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="title" />
        <TextField source="description" />
        <ArrayField source="categories">
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ArrayField>
      </Datagrid>
    </List>
  );
};
