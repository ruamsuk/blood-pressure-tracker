import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { BloodPressure } from '../models/blood-pressure.model';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BloodService {
  private collectionName = 'bloodPressureRecords';

  constructor(private firestore: Firestore) {}

  createBlood(bp: BloodPressure) {
    const bpCollection = collection(this.firestore, this.collectionName);
    return from(addDoc(bpCollection, bp));
  }

  updateBlood(id: string, bp: Partial<BloodPressure>): Observable<void> {
    const bpDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(updateDoc(bpDoc, bp));
  }

  deleteBlood(id: string): Observable<void> {
    const bpDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(deleteDoc(bpDoc));
  }

  getBloods() {
    const bpCollection = collection(this.firestore, this.collectionName);
    const bpQuery = query(bpCollection, orderBy('date', 'desc'));
    return collectionData(bpQuery, { idField: 'id' }).pipe(
      map((data) => data as BloodPressure[]),
    );
  }
}
