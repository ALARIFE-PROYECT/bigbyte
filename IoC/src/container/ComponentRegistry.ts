/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/ioc.
 *
 * Licensed under the Apache-2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */

import { MissingDependencyError } from '../exception/MissingDependencyError';
import { BufferComponent } from '../model/Buffer';
import { Component, ComponentOptions } from '../model/Component';

/**
 * Clase que gestiona el registro de componentes.
 */
class ComponentRegistry {
  private registry: Array<Component>;

  private bufferEvent: Array<BufferComponent>;

  constructor() {
    this.registry = [];
    this.bufferEvent = [];
  }

  /**
   * Recupera todos los componentes del registry por clase.
   *
   * @param items - Las clases de los componentes a buscar.
   * @returns
   */
  private getAllByClass(items: Function[] = []): Array<Component> {
    const result: Array<Component> = new Array();

    items.forEach((target: Function) => {
      // siempre existe, por que si no strict proboca la excepcion.
      result.push(this.getByClass(target)!);
    });

    return result;
  }

  private emit(component: Component): void {
    const pendingItems = this.bufferEvent.filter((e: BufferComponent) => component[e.key] === e.value);

    pendingItems.forEach((item: BufferComponent) => item.callback(component));

    if (pendingItems.length > 0) {
        this.bufferEvent = this.bufferEvent.filter((e: BufferComponent) => !pendingItems.includes(e));
    }
  }

  /**
   * Añade un componente al registry.
   *
   * @param Target - La clase del componente a añadir.
   * @param dependencies - Las dependencias del componente.
   * @param options - Opciones del componente.
   * @returns
   */
  add(Target: Function, dependencies: Function[], options?: ComponentOptions): string {
    const dependentComponents = this.getAllByClass(dependencies);
    const component = new Component(Target, dependentComponents, options);

    this.registry.push(component);
    this.emit(component);

    return component.id;
  }

  /**
   * Rescata el componente por la clase.
   *
   * @param Target - La clase del componente a buscar.
   * @param strict - Si es true, lanza una excepción si no se encuentra el componente.
   * @returns
   */
  getByClass(Target: Function, strict: boolean = true): Component | undefined {
    const injectable = this.registry.find((c) => c.class === Target);

    if (!injectable && strict === true) {
      throw new MissingDependencyError(Target);
    }

    return injectable;
  }

  /**
   * Rescata el componente por el id.
   *
   * @param id - El id del componente a buscar.
   * @returns
   */
  getById(id: string): Component {
    const injectable = this.registry.find((c) => c.id === id);

    if (!injectable) {
      throw new MissingDependencyError(id);
    }

    return injectable;
  }

  /**
   * Rescata el componente por el nombre.
   *
   * @param name - El nombre del componente a buscar.
   * @returns
   */
  getByName(name: string): Component | undefined {
    return this.registry.find((c) => c.name === name);
  }

  /**
   * Observa y reacciona a un componente por su nombre.
   *
   * @param name - Nombre del componente a escuchar.
   * @param callback - Función a ejecutar cuando el componente esté disponible.
   */
  onComponentByName(name: string, callback: (component: Component) => void): void {
    const bufferComponent: BufferComponent = {
      key: 'name',
      value: name,
      callback
    };

    this.bufferEvent.push(bufferComponent);
  }

  /**
   * Comprueba si el componente existe en el registry por id o por clase.
   *
   * @param value - El valor a comprobar. Puede ser una clase o un id.
   * @returns
   */
  has(value: any): boolean {
    const index = this.registry.findIndex((c) => c.class === value || c.id === value);
    return index !== -1;
  }
}

export const componentRegistry = new ComponentRegistry();
