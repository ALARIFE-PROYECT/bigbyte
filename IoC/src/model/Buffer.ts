import { Component } from "./Component";

export interface BufferComponent {
    key: keyof Component;
    value: any;
    callback: (component: Component) => void;
}
