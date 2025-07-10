import { Component } from '@angular/core';
import { Launch, Rocket } from '../../core/interface/Interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  //   view: 'past' | 'upcoming' = 'past';
  //   launches: Launch[] = [];
  //   rockets = new Map<string, Rocket>();
  //   loading = false;
  //   error = '';

  //   // Reactive Form
  //   filterForm = new FormGroup({
  //     year: new FormControl(''),
  //     status: new FormControl('all'),
  //   });

  //   sortKey: 'date' | 'name' = 'date';
  //   sortAsc = false;

  //   // Pagination
  //   pageSize = 10;
  //   currentPage = 1;

  //   totalCount = 0;

  //   constructor(private api: SpacexApiService) {}

  //   ngOnInit() {
  //     this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  //     this.loadLaunches();
  //   }

  //   toggleView(v: 'past' | 'upcoming') {
  //     this.view = v;
  //     this.currentPage = 1;
  //     this.loadLaunches();
  //   }

  //   loadLaunches() {
  //     this.loading = true;
  //     this.error = '';
  //     const fetch =
  //       this.view === 'past'
  //         ? this.api.getPast(
  //             this.pageSize,
  //             (this.currentPage - 1) * this.pageSize
  //           )
  //         : this.api.getUpcoming();

  //     fetch.subscribe({
  //       next: (data) => {
  //         this.launches = data;
  //         this.totalCount = data.length + (this.view === 'past' ? 0 : 0); // adapt if API supports count
  //         this.loadRockets();
  //         this.applyFilters();
  //         this.loading = false;
  //       },
  //       error: (err) => {
  //         this.error = err.message;
  //         this.loading = false;
  //       },
  //     });
  //   }

  //   loadRockets() {
  //     const ids = [...new Set(this.launches.map((l) => l.rocket))].filter(
  //       (id) => !this.rockets.has(id)
  //     );

  //     if (ids.length) {
  //       forkJoin(ids.map((id) => this.api.getRocket(id))).subscribe({
  //         next: (rockets) => {
  //           rockets.forEach((r) => this.rockets.set(r.id, r));
  //           this.applyFilters();
  //         },
  //       });
  //     } else {
  //       this.applyFilters();
  //     }
  //   }

  //   applyFilters() {
  //     const { year, status } = this.filterForm.value;
  //     let filtered = [...this.launches];

  //     if (year)
  //       filtered = filtered.filter(
  //         (l) => new Date(l.date_utc).getFullYear().toString() === year
  //       );
  //     if (status !== 'all') {
  //       filtered = filtered.filter((l) =>
  //         status === 'success'
  //           ? l.success
  //           : status === 'failure'
  //           ? l.success === false
  //           : true
  //       );
  //     }

  //     filtered.sort((a, b) => {
  //       const key = this.sortKey === 'date' ? 'date_utc' : 'name';
  //       return this.sortAsc
  //         ? a[key].localeCompare(b[key])
  //         : b[key].localeCompare(a[key]);
  //     });

  //     this.displayed = filtered;
  //   }

  //   displayed: Launch[] = [];

  //   changeSort(key: 'date' | 'name') {
  //     this.sortKey = key;
  //     this.sortAsc = this.sortKey === key ? !this.sortAsc : false;
  //     this.applyFilters();
  //   }

  //   retry() {
  //     this.loadLaunches();
  //   }

  //   goPage(n: number) {
  //     if (n < 1) return;
  //     this.currentPage = n;
  //     this.loadLaunches();
  //   }

  // }
  launches: any[] = [];
  rockets = new Map<string, any>();
  view: 'past' | 'upcoming' = 'past';
  loading = false;
  error = '';
  displayed: any[] = [];

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.loadLaunches();
  }

  toggleView(view: 'past' | 'upcoming') {
    console.log(' Toggling view to:', view);
    this.view = view;
    this.loadLaunches();
  }

  loadLaunches() {
    this.loading = true;
    this.error = '';
    this.launches = [];
    this.displayed = [];

    const apiCall =
      this.view === 'past'
        ? this.api.getPastLaunches()
        : this.api.getUpcomingLaunches();

    console.log('📡 Fetching launches for view:', this.view);

    apiCall.subscribe({
      next: (data) => {
        console.log(' Launches fetched:', data.length);
        this.launches = data || [];
        this.fetchAllRockets();
      },
      error: (err) => {
        this.error = 'Failed to load launches';
        this.loading = false;
        console.error(' Error loading launches:', err);
      },
    });
  }

  fetchAllRockets() {
    const rocketIds = Array.from(new Set(this.launches.map((l) => l.rocket)));
    console.log(' Fetching rockets for IDs:', rocketIds);

    if (!rocketIds.length) {
      console.warn(' No rocket IDs found.');
      this.displayed = [...this.launches];
      this.loading = false;
      return;
    }

    this.api.getRocketsByIds(rocketIds).subscribe({
      next: (rockets) => {
        rockets.forEach((r) => {
          if (r && r.id) {
            this.rockets.set(r.id, r);
          }
        });

        this.displayed = [...this.launches];
        console.log(' Displaying launches:', this.displayed.length);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load rockets';
        this.loading = false;
        console.error(' Error loading rockets:', err);
      },
    });
  }
}
