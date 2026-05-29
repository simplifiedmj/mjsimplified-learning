---
title: "Angular Components Deep Dive: Architecture, Bindings, and Lifecycle"
slug: "angular-components-deep-dive"
category: "angular"
description: "Master Angular component design, from metadata configuration to data binding techniques (@Input/@Output) and lifecycle hooks like ngOnInit and ngOnChanges."
date: "2026-05-08"
thumbnail: "/images/tutorials/angular-components.jpg"
tags: ["Angular", "TypeScript", "Frontend Development", "Components"]
youtubeId: "37Gj5bS1rSg"
author: "MJSimplified"
---

Angular is a component-driven framework. Every Angular application is built as a tree of nested components. A component controls a patch of the screen (its view) and encapsulates the HTML template, TypeScript class logic, and CSS styling.

In this tutorial, we will explore Angular component architecture, data bindings, communication via `@Input()` and `@Output()`, and component lifecycles.

## 1. Structure of an Angular Component

An Angular component consists of three files:
1. **TypeScript Class (`.component.ts`)**: Contains data and application logic.
2. **HTML Template (`.component.html`)**: Defines the visual layout.
3. **CSS Styles (`.component.css` or `.component.scss`)**: Styles specific to this component.

Here is a standard component decorator configuration:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true // Modern Angular uses Standalone Components by default
})
export class UserProfileComponent {
  username = 'MJSimplified';
  status = 'Active';
}
```

## 2. Four Types of Template Data Binding

Angular offers four distinct ways to bind data between your TypeScript code and HTML template:

### A. Interpolation `{{ value }}`
Binds data from the component class to the template textually:
```html
<p>Welcome back, {{ username }}!</p>
```

### B. Property Binding `[property]="value"`
Binds data from the component class to a DOM element property:
```html
<button [disabled]="status !== 'Active'">Submit Details</button>
```

### C. Event Binding `(event)="handler()"`
Listens for DOM events and executes component methods when triggered:
```html
<button (click)="logoutUser()">Log Out</button>
```

### D. Two-Way Binding `[(ngModel)]="value"`
Synchronizes data bidirectionally. Useful for forms. Needs `FormsModule` imported:
```html
<input [(ngModel)]="username" placeholder="Edit username" />
```

## 3. Component Communication: Inputs and Outputs

Components are nested inside each other. To pass data between parent and child components, we use `@Input()` and `@Output()`.

### Child Component (`user-card.component.ts`):
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h3>{{ name }}</h3>
      <button (click)="notifyParent()">Select User</button>
    </div>
  `,
  standalone: true
})
export class UserCardComponent {
  @Input() name: string = '';
  @Output() userSelected = new EventEmitter<string>();

  notifyParent() {
    this.userSelected.emit(this.name);
  }
}
```

### Parent Component Template:
```html
<!-- Parent passes name down via [name] and listens for (userSelected) -->
<app-user-card 
  [name]="currentUser" 
  (userSelected)="onUserSelected($event)">
</app-user-card>
```

## 4. Component Lifecycle Hooks

Angular manages the lifecycle of components: creating them, rendering them, placing their children, checking them for data changes, and destroying them before removing them from the DOM. 

You can tap into key moments of this lifecycle by implementing lifecycle interface hooks:

* `ngOnChanges()`: Responds when Angular sets or resets data-bound input properties (`@Input()`).
* `ngOnInit()`: Initializes the component after Angular first displays the data-bound properties. This is the ideal place to fetch remote data.
* `ngDoCheck()`: Detects and acts upon changes that Angular can't or won't detect on its own.
* `ngAfterContentInit()` / `ngAfterContentChecked()`: Runs after Angular projects external content into the component.
* `ngAfterViewInit()` / `ngAfterViewChecked()`: Runs after Angular initializes the component's views and child views.
* `ngOnDestroy()`: Clean up just before Angular destroys the component. Unsubscribe from Observables, detach event handlers to avoid memory leaks.

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard',
  template: `<p>Data count: {{ data.length }}</p>`,
  standalone: true
})
export class DashboardComponent implements OnInit, OnDestroy {
  data: any[] = [];
  private sub!: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Fetch data when component is ready
    this.sub = this.dataService.getData().subscribe(res => {
      this.data = res;
    });
  }

  ngOnDestroy() {
    // Prevent memory leaks
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
```
