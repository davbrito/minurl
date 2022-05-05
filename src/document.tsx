const Document = ({ scriptSrc }: { scriptSrc: string }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script type="module" src={scriptSrc}></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  );
};
export default Document;
