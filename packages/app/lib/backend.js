import moment from 'moment'
import { Observable, pipe } from 'rxjs'
import { scan, mapTo, zipAll } from 'rxjs/operators'
import init from "@skolplattformen/embedded-api"
export const api = init(fetch)  // keep a static version of this object so we can keep the session alive

export const childrenWithDetails = (children) => Observable.from(children).flatMap(child => childDetails(child))

// TODO Add better error handling perhaps?
export const childDetails = (child) => {
  console.log('get details for ', child.name)
  
  const news = Observable.fromPromise(
    api
      .getNews(child)
      .then(news => {news})
  ).startWith([])

  const calendar = Observable.fromPromise(
    api
      .getCalendar(child)
      .then(calendar => {calendar})
  ).startWith([])

  const notifications = Observable.fromPromise(
    api
      .getNotifications(child)
      .then(notifications => {notifications})
  ).startWith([])

  const schedule = Observable.fromPromise(
    api
      .getSchedule(child)
      .then(schedule => {schedule})
  ).startWith([])

  const classmates = Observable.fromPromise(
    api
      .getClassmates(child)
      .then(classmates => {classmates})
  ).startWith([])

  const menu = Observable.fromPromise(
    api
      .getMenu(child)
      .then(menu => {menu})
  ).startWith([])

  return pipe( 
    zipAll(Observable.from([child]), news, calendar, notifications, schedule, classmates, menu),
    scan((child, update) => ({...child, ...update})) // merge the previous value with the updated one and emit the result
  )
}