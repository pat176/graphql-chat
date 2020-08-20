import React, { useState } from "react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      content
      user
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;
const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);
  if (!data) {
    return null;
  }
  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: user === messageUser ? "flex-end" : "flex-start",
              paddingBottom: "1em",
            }}
          >
            {messageUser !== user && (
              <div
                style={{
                  boxSizing: "border-box",
                  height: 50,
                  width: 50,
                  marginRight: "0.5em",
                  border: "2px solid #e5e6ea",
                  borderRadius: "50%",
                  textAlign: "center",
                  fontSize: "18pt",
                  paddingTop: 5,
                }}
              >
                {messageUser.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              style={{
                background: user === messageUser ? "#58bf56" : "#e5e6ea",
                color: user === messageUser ? "white" : "black",
                padding: "1em",
                borderRadius: "1em",
                maxWidth: "60%",
              }}
            >
              {content}
            </div>
          </div>
        );
      })}
    </>
  );
};

const Chat = () => {
  const [state, setState] = useState({
    user: "Parth",
    content: "",
  });
  const [postMessage] = useMutation(POST_MESSAGE);

  return (
    <div
      style={{
        margin: "2px auto",
      }}
    >
      <Messages user={state.user} />
      <form
        onSubmit={(e) => {
          console.log("we are here");
          e.preventDefault();
          postMessage({
            variables: state,
          });
          setState({
            ...state,
            content: "",
          });
        }}
        style={{
          display: "grid",
          flexDirection: "row",
          gridTemplateColumns: "2fr 4fr 1fr 0fr",
          gridGap: "6px",
        }}
      >
        <input
          type="text"
          onChange={(e) => {
            setState({
              ...state,
              user: e.target.value,
            });
          }}
          value={state.user}
        />
        <input
          type="text"
          onChange={(e) => {
            setState({
              ...state,
              content: e.target.value,
            });
          }}
          value={state.content}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default () => {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
};
