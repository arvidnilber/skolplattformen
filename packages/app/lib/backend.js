import moment from 'moment'
import Observble from 'rxjs'
import init from "@skolplattformen/embedded-api"
import { not } from 'react-native-reanimated'
export const api = init(fetch)  // keep a static version of this object so we can keep the session alive

export const loadChildrenDetails = async (children, what = {news: true}) => await Promise.all(children.map(async child => ({
  ...child,
  news: !what.news ? child.news : await api.getNews(child).catch(err => [{err}]),
  calendar: !what.calendar ? child.calendar : await api.getCalendar(child).catch(err => [{err}]),
  notifications:  !what.notifications ? child.notifications : await api.getNotifications(child).catch(err => [{err}]),
  schedule: !what.schedule ? child.schedule : await api.getSchedule(child, moment().startOf('day'), moment().add(7,'days').endOf('day')).catch(err => [{err}]),
  classmates: !what.classmates ? child.classmates : await api.getClassmates(child).catch(err => [{err}]),
  menu: !what.menu ? child.menu : await api.getMenu(child).catch(err => [{err}]),
})))

export const childrenWithDetails = (children) => Observble.from(children).flatMap(childDetails)

// TODO Add better error handling perhaps?
export const childDetails = (child) => {
  const news = Observable.defer(async () => {
    try {
      return api.getNews(child);
    } catch(e) {
      return Promise.resolve([]);
    }
  }).startWith([]);
  
  const calendar = Observble.defer(async () => {
    try {
      return api.getCalendar(child);
    } catch(e) {
      return Promise.resolve([]);
    }
  }).startWith([])

  const notification = Observble.defer(async () => {
    try {
      return api.getNotifications(child);
    } catch(e) {
      return Promise.resolve([]);
    }
  }).startWith([])


  const schedule = Observble.defer(async () => {
    try {
      return api.getSchedule(child);
    } catch(e) {
      return Promise.resolve([]);
    }
  }).startWith([])


  const classmates = Observble.defer(async () => {
    try {
      return api.getClassmates(child);
    } catch(e) {
      return Promise.resolve([]);
    }
  }).startWith([])


  const menu = Observble.defer(async () => {
    try {
      return api.getMenu(child);
    } catch(e) {
      return Promise.resolve([]);
    }
  }).startWith([])

  return Observble.zipAll(Observable.of(child).repeat(1), news, calendar, notifications, schedule, classmates, menu, zipChildDetails)
}

const zipChildDetails = (child, news, calendar, notifications, schedule, classmates, menu) => {
  return {...child, news, calendar, notifications, schedule, classmates, menu}
}