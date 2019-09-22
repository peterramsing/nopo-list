import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export interface Item { label: string; timestamp: number; quantity?: number; purchased?: number; gender?: string; essential?: boolean;}
export interface ItemId extends Item { id: string; }
export interface NewItem { name: string; quantity?: number; gender?: string; essential?: boolean;}

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
    this.newItem = {name: '', quantity: 1};

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
      label: item.label,
      timestamp: item.timestamp,
      purchased: item.purchased,
      gender: item.gender,
      essential: item.essential
    });
  }

  submitNewItem() {
    if (this.newItem.name === '') { return }
    this._itemCollection.add({
      quantity: this.newItem.quantity,
      purchased: 0,
      label: this.newItem.name,
      timestamp: Date.now(),
      gender: this.newItem.gender,
      essential: this.newItem.essential
    });
  }

  deleteItem(item: ItemId) {
    if (window.confirm(`Do you want to delete ${item.label}?`)) {
      this.doDelete(item);
    }
  }

  private doDelete(item: ItemId) {
    this._itemDoc = this.afs.doc<ItemId>(`items/${item.id}`);
    this._itemDoc.delete();
  }

  deleteAllItems() {
    if (window.confirm(`Do you want to delete all of them?`)) {
      const items = this._itemCollection.snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Item;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
      items.subscribe(list => {
        list.forEach(item => {
          this.doDelete(item);
        });
      });
    }
  }

  get showPowerToolsIndicator() {
    return showPowerTools;
  }
}
