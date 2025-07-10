import { Component } from '@angular/core';
import { Launch, Payload, Rocket } from '../../core/interface/Interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-launch-detail',
  imports: [CommonModule],
  templateUrl: './launch-detail.component.html',
  styleUrl: './launch-detail.component.css',
})
export class LaunchDetailComponent {
  //   launch!: Launch;
  //   rocket?: Rocket;
  //   payloads: Payload[] = [];
  //   loading = true;
  //   error = '';
  //   constructor(
  //     private route: ActivatedRoute,
  //     private api: SpacexApiService,
  //     private router: Router
  //   ) {}
  //   ngOnInit() {
  //     this.load();
  //   }
  //   load() {
  //     this.loading = true;
  //     this.error = '';
  //     const id = this.route.snapshot.paramMap.get('id')!;
  //     this.api.getById(id).subscribe({
  //       next: (l) => {
  //         this.launch = l;
  //         forkJoin([
  //           this.api.getRocket(l.rocket),
  //           forkJoin(l.payloads.map((pid) => this.api.getPayload(pid))),
  //         ]).subscribe({
  //           next: ([r, ps]) => {
  //             this.rocket = r;
  //             this.payloads = ps;
  //             this.loading = false;
  //           },
  //           error: (err) => {
  //             this.error = err.message;
  //             this.loading = false;
  //           },
  //         });
  //       },
  //       error: (err) => {
  //         this.error = err.message;
  //         this.loading = false;
  //       },
  //     });
  //   }
  //   back() {
  //     this.router.navigate(['/']);
  //   }
}
