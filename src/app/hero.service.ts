import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Hero } from '../app/heroes/hero';
import { HEROES } from './mock-heroes';

import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class HeroService {

	constructor(
		private messageService: MessageService,
		private http: HttpClient,
		private heroesUrl = 'api/heroes'

	) { }

	private log(message: string) {
		this.messageService.add('HeroService: ' + message);
	}

	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		)
	}

	/** GET heroes from the server */
	getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
			tap(heroes => this.log(`fetched heroes`)),
			catchError(this.handleError('getHeroes', []))
			);
	}

	/** PUT: update the hero on the server */
	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, httpOptions)
	}

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

}
