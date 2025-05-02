import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Noto Sans KR', sans-serif;
    color: #333;
    background-color: #fff;
    line-height: 1.5;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  button, input, textarea {
    font-family: inherit;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
  }
  
  main {
    min-height: calc(100vh - 200px);
  }
`;

export default GlobalStyles;
