import moment from 'moment'
<<<<<<< HEAD
import { Observable, pipe } from 'rxjs'
import { scan, mapTo, zipAll } from 'rxjs/operators'
=======
import { defer, zipAll, of, from } from 'rxjs/operators'
>>>>>>> 67a81a4ff164755bddc4b8157ad3d1c78df5a29f
import init from "@skolplattformen/embedded-api"
export const api = init(fetch)  // keep a static version of this object so we can keep the session alive

<<<<<<< HEAD
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
=======
export const loadChildrenDetails = async (children, what = {news: true}) => await Promise.all(children.map(async child => ({
  ...child,
  news: !what.news ? child.news : await api.getNews(child).catch(err => [{err}]),
  calendar: !what.calendar ? child.calendar : await api.getCalendar(child).catch(err => [{err}]),
  notifications:  !what.notifications ? child.notifications : await api.getNotifications(child).catch(err => [{err}]),
  schedule: !what.schedule ? child.schedule : await api.getSchedule(child, moment().startOf('day'), moment().add(7,'days').endOf('day')).catch(err => [{err}]),
  classmates: !what.classmates ? child.classmates : await api.getClassmates(child).catch(err => [{err}]),
  menu: !what.menu ? child.menu : await api.getMenu(child).catch(err => [{err}]),
})))

export const childrenWithDetails = (children, what = {news: true}) => from(children).mergeMap((c) => childDetails(c, what))

// TODO Add better error handling perhaps?
export const childDetails = (child, what) => {
  const news = defer(async () => {
    if (!what.news) return Promise.resolve(child.news)
    return api.getNews(child);
  }).startWith([]);
  
  const calendar = defer(async () => {
    if (!what.calendar) return Promise.resolve(child.calendar)
    return api.getCalendar(child);
  }).startWith([])

  const notifications = defer(async () => {
    if (!what.notifications) return Promise.resolve(child.notifications)
    return api.getNotifications(child);
  }).startWith([])


  const schedule = defer(async () => {
    if (!what.schedule) return Promise.resolve(child.schedule)
    return api.getSchedule(child);
  }).startWith([])


  const classmates = defer(async () => {
    if (!what.classmates) return Promise.resolve(child.classmates)
    return api.getClassmates(child)
  }).startWith([])


  const menu = defer(async () => {
    if (!what.menu) return Promise.resolve(child.menu)
    return api.getMenu(child)
  }).startWith([])

  return zipAll(of(child).repeat(1), news, calendar, notifications, schedule, classmates, menu, zipChildDetails)
}

const zipChildDetails = (child, news, calendar, notifications, schedule, classmates, menu) => {
  return {...child, news, calendar, notifications, schedule, classmates, menu}
>>>>>>> 67a81a4ff164755bddc4b8157ad3d1c78df5a29f
}