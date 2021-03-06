import React from "react";
import { shallow, mount, render } from "enzyme";
import PaypalClassic from "../form/confirmation/PaypalClassic";
import { Provider } from "react-redux";
import store from "../store";

it("renders default payment form", () => {
  let props = {
    onPaymentStarted: e => e,
    paymentStarted: false,
    paymentInfo_owed: {
      currency: "USD"
    },
    paymentInfo_received: {
      currency: "USD",
      total: 0
    },
    paymentInfo: {
      currency: "USD",
      items: [
        {
          name: "Name",
          description: "Description",
          amount: 40,
          quantity: 1
        }
      ]
    },
    paymentMethodInfo: {},
    key: "k", // must be unique.
    onPaymentComplete: e => e,
    onPaymentError: e => e,
    responseId: "r123456",
    formId: "f123456",
    formData: {},
    paymentMethodName: "paypal_classic"
    // todo: get user's entered data.
  };
  const wrapper = render(
    <Provider store={store}>
      <PaypalClassic {...props} />
    </Provider>
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders subscription payment form", () => {
  let props = {
    onPaymentStarted: e => e,
    paymentStarted: false,
    paymentInfo_owed: {
      currency: "USD"
    },
    paymentInfo_received: {
      currency: "USD",
      total: 0
    },
    paymentInfo: {
      currency: "USD",
      items: [
        {
          name: "Name",
          description: "Description",
          amount: 40,
          quantity: 1,
          recurrenceDuration: "1M"
        }
      ]
    },
    paymentMethodInfo: {},
    onPaymentComplete: e => e,
    onPaymentError: e => e,
    responseId: "r123456",
    formId: "f123456",
    formData: {},
    paymentMethodName: "paypal_classic"
    // todo: get user's entered data.
  };
  const wrapper = render(
    <Provider store={store}>
      <PaypalClassic {...props} />
    </Provider>
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders subscription payment form with max number of recurrenceTimes", () => {
  let props = {
    onPaymentStarted: e => e,
    paymentStarted: false,
    paymentInfo_owed: {
      currency: "USD"
    },
    paymentInfo_received: {
      currency: "USD",
      total: 0
    },
    paymentInfo: {
      currency: "USD",
      items: [
        {
          name: "Name",
          description: "Description",
          amount: 40,
          quantity: 1,
          recurrenceDuration: "1M",
          recurrenceTimes: "12"
        }
      ]
    },
    paymentMethodInfo: {},
    onPaymentComplete: e => e,
    onPaymentError: e => e,
    responseId: "r123456",
    formId: "f123456",
    formData: {},
    paymentMethodName: "paypal_classic"
    // todo: get user's entered data.
  };
  const wrapper = render(
    <Provider store={store}>
      <PaypalClassic {...props} />
    </Provider>
  );
  expect(wrapper).toMatchSnapshot();
});
