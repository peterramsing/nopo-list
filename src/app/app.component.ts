import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export interface Item { label: string; done: boolean; timestamp: number; }
export interface ItemId extends Item { id: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private itemCollection: AngularFirestoreCollection<Item>;
  private itemDoc: AngularFirestoreDocument<Item>; // NOTE: Maybe?
  items: Observable<ItemId[]>;
  newItem: string;

  constructor(private afs: AngularFirestore) {
    this.newItem = '';

    this.itemCollection = afs.collection<Item>('items', ref => ref.orderBy('timestamp', 'desc'));
    this.items = this.itemCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  toggleItemComplete(item: ItemId) {
    this.itemDoc = this.afs.doc<ItemId>(`items/${item.id}`);
    this.itemDoc.update({
      done: item.done,
      label: item.label,
      timestamp: item.timestamp,
    });
  }

  submitNewItem() {
    if (this.newItem === '') { return }
    this.itemCollection.add({
      label: this.newItem,
      done: false,
      timestamp: Date.now(),
    });
    this.newItem = '';
  }

  deleteItem(item: ItemId) {
    if (window.confirm(`Do you want to delete ${item.label}?`)) {
      this.itemDoc = this.afs.doc<ItemId>(`items/${item.id}`);
      this.itemDoc.delete();
    }
  }
}
