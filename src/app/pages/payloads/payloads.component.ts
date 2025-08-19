import { Component, OnInit } from '@angular/core';
import { Payload } from '../../core/interface/Interface';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';

@Component({
  selector: 'app-payloads',
  imports: [CommonModule, AgGridModule],
  templateUrl: './payloads.component.html',
  styleUrl: './payloads.component.css',
})
export class PayloadsComponent implements OnInit {
  // payloads: Payload[] = [];
  // loading = false;
  // error = '';

  // constructor(private api: SpacexApiService) {}

  // ngOnInit(): void {
  //   this.loading = true;
  //   this.api.getAllPayloads().subscribe({
  //     next: (data) => {
  //       this.payloads = data;
  //       this.loading = false;
  //     },
  //     error: (_) => {
  //       this.error = 'Failed to load payloads.';
  //       this.loading = false;
  //     },
  //   });
  // }

  payloads: Payload[] = [];
  loading = false;
  error = '';

  columnDefs: ColDef<Payload>[] = [
    // { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true },
    { headerName: 'Orbit', field: 'orbit', sortable: true, filter: true },
    {
      headerName: 'Mass_kg',
      field: 'mass_kg',
      sortable: true,
      filter: true,
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllPayloads().subscribe({
      next: (data) => {
        this.payloads = data;
        this.loading = false;
      },
      error: (_) => {
        this.error = 'Failed to load payloads.';
        this.loading = false;
      },
    });
  }
}
