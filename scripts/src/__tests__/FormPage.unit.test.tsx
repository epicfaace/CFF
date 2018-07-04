import React from 'react';
import store from "src/store";
import FormPage from 'src/form/FormPage';
import schema from './schema.json';
import uiSchema from './uiSchema.json';
import formOptions from './formOptions.json';
import { shallow, mount, render } from 'enzyme';

// https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f

let form_preloaded = {schema, uiSchema, formOptions};

it('renders FormPage correctly', () => {
  const wrapper = shallow(
    <FormPage store={store} formId={"test123"} form_preloaded={form_preloaded} />
  ).dive();
  expect(wrapper).toMatchSnapshot();
}); 