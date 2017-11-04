import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export interface Item { label: string; done: boolean; timestamp: number; quantity?: number; }
export interface ItemId extends Item { id: string; }
export interface NewItem { name: string; quantity?: number; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _itemCollection: AngularFirestoreCollection<Item>;
  private _itemDoc: AngularFirestoreDocument<Item>; // NOTE: Maybe?
  items: Observable<ItemId[]>;
  newItem: NewItem;

  constructor(private afs: AngularFirestore) {
    this.newItem = {name:'', quantity: 1};

    this._itemCollection = afs.collection<Item>('items', ref => ref.orderBy('timestamp', 'desc'));
    this.items = this._itemCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  toggleItemComplete(item: ItemId) {
    this._itemDoc = this.afs.doc<ItemId>(`items/${item.id}`);
    this._itemDoc.update({
      done: item.done,
      label: item.label,
      timestamp: item.timestamp,
    });
  }

  submitNewItem() {
    if (this.newItem.name === '') { return }
    this._itemCollection.add({
      quantity: this.newItem.quantity,
      label: this.newItem.name,
      done: false, // This might get complex...
      timestamp: Date.now(),
    });
    this.newItem = {name:'', quantity: 1};
  }

  deleteItem(item: ItemId) {
    if (window.confirm(`Do you want to delete ${item.label}?`)) {
      this._itemDoc = this.afs.doc<ItemId>(`items/${item.id}`);
      this._itemDoc.delete();
    }
  }
}
