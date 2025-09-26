import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalMode } from '@data/enums/modal-mode';
import { User } from '@data/models/user';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl: string = `${environment.apiUrl}/auth/users`;
  private readonly http = inject(HttpClient)

  private _selectedUser = signal<User | null>(null);
  private _modeUserModal = signal<ModalMode | undefined>(undefined);
  private _sorted = signal<boolean>(false)

  public selectedUser = computed(() => this._selectedUser());
  public modeUserForm = computed(() => this._modeUserModal());
  public sorted = computed(()=> this._sorted())

  public select(user: User | null) {
    this._selectedUser.set(user);
  }

  public setModeModal(mode: ModalMode | undefined) {
    this._modeUserModal.set(mode);
  }

  public setSorted(mode: boolean){
    this._sorted.set(mode)
  }

  //COMUNICACIÓN CON LA API
  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  public createUser(user: User): Observable<User> {
    console.log('User to upload:', user)
    return this.http.post<User>(`${this.apiUrl}`, user)
  }

  public deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
