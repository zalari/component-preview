class ExampleHelloWorld extends HTMLElement {

  constructor() {
    super();
    this.innerHTML = 'Loading';
  }

  connectedCallback() {
    this.innerHTML = 'Example component';
  }

}

customElements.define('example-hello-world', ExampleHelloWorld);