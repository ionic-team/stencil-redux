import { Component, h, Prop } from '@stencil/core';


@Component({
  tag: 'stencil-store'
})
export class StencilStore {
  render() {
    return (
      <slot></slot>
    );
  }
}
