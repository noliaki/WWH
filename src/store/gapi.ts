import { ActionTree, ActionContext, MutationTree, GetterTree } from 'vuex'
import { Country } from '~/store/countries'
import { dateFormat } from '~/utils'

declare const gapi: any

interface CountryHolidays {
  alpha2Code: string
  language: string
  year: number
  summary: string
  holidays: HolidayData[]
}

export interface State {
  doneClientInit: boolean
  holidays: CountryHolidays[]
  targetDate: Date | undefined
  isFetching: boolean
}

export interface ResponceCalendar {
  kind: 'calendar#events'
  etag: string
  summary: string
  description: string
  updated: string
  timeZone: string
  accessRole: string
  defaultReminders: {
    method: string
    minutes: number
  }[]
  nextPageToken: string
  nextSyncToken: string
  items: Resource[]
}

export interface Resource {
  kind: 'calendar#event'
  etag: string
  id: string
  status: string
  htmlLink: string
  created: string
  updated: string
  summary: string
  description: string
  location: string
  colorId: string
  creator: {
    id: string
    email: string
    displayName: string
    self: boolean
  }
  organizer: {
    id: string
    email: string
    displayName: string
    self: boolean
  }
  start: {
    date: string
    dateTime: string
    timeZone: string
  }
  end: {
    date: string
    dateTime: string
    timeZone: string
  }
  endTimeUnspecified: boolean
  recurrence: string[]
  recurringEventId: string
  originalStartTime: {
    date: string
    dateTime: string
    timeZone: string
  }
  transparency: string
  visibility: string
  iCalUID: string
  sequence: number
  attendees: {
    id: string
    email: string
    displayName: string
    organizer: boolean
    self: boolean
    resource: boolean
    optional: boolean
    responseStatus: string
    comment: string
    additionalGuests: number
  }[]
  attendeesOmitted: boolean
  extendedProperties: {
    private: {
      [key: string]: string
    }
    shared: {
      [key: string]: string
    }
  }
  hangoutLink: string
  conferenceData: {
    createRequest: {
      requestId: string
      conferenceSolutionKey: {
        type: string
      }
      status: {
        statusCode: string
      }
    }
    entryPoints: {
      entryPointType: string
      uri: string
      label: string
      pin: string
      accessCode: string
      meetingCode: string
      passcode: string
      password: string
    }[]
    conferenceSolution: {
      key: {
        type: string
      }
      name: string
      iconUri: string
    }
    conferenceId: string
    signature: string
    notes: string
    gadget: {
      type: string
      title: string
      link: string
      iconLink: string
      width: number
      height: number
      display: string
      preferences: {
        [key: string]: string
      }
    }
    anyoneCanAddSelf: boolean
    guestsCanInviteOthers: boolean
    guestsCanModify: boolean
    guestsCanSeeOtherGuests: boolean
    privateCopy: boolean
    locked: boolean
    reminders: {
      useDefault: boolean
      overrides: [
        {
          method: string
          minutes: number
        }
      ]
    }
    source: {
      url: string
      title: string
    }
    attachments: {
      fileUrl: string
      title: string
      mimeType: string
      iconLink: string
      fileId: string
    }[]
  }
}

interface HolidayData {
  start: {
    date: string
    dateTime: string
    timeZone: string
  }
  end: {
    date: string
    dateTime: string
    timeZone: string
  }
  summary: string
}

export const state: () => State = (): State => ({
  doneClientInit: false,
  holidays: [],
  targetDate: new Date(),
  isFetching: false
})

export const getters: GetterTree<State, never> = {
  hasHolidays: ({ holidays }: State) => ({
    alpha2Code,
    language,
    year
  }: {
    alpha2Code: string
    language: string
    year: number
  }): boolean =>
    holidays.find(
      (item: CountryHolidays): boolean =>
        item.alpha2Code === alpha2Code &&
        item.language === language &&
        item.year === year
    ) !== undefined,
  getCountryHolidaysByDateString: ({ holidays }: State) => (
    dateString: string
  ): { alpha2Code: string; holidaySummaries: string[]; summary: string }[] => {
    return holidays.reduce(
      (
        prev: {
          alpha2Code: string
          holidaySummaries: string[]
          summary: string
        }[],
        current: CountryHolidays
      ): {
        alpha2Code: string
        holidaySummaries: string[]
        summary: string
      }[] => {
        const holidaySummaries = current.holidays
          .filter(
            (holiday: any): boolean =>
              dateString >= holiday.start.date && dateString < holiday.end.date
          )
          .map((item: any): string => item.summary)

        if (holidaySummaries.length > 0) {
          prev.push({
            alpha2Code: current.alpha2Code,
            summary: current.summary,
            holidaySummaries
          })
        }

        return prev
      },
      []
    )
  },
  getTargetCountryHolidays(
    { targetDate }: State,
    getters: any
  ): { alpha2Code: string; holidaySummaries: string[] }[] | undefined {
    if (!targetDate) return

    return getters.getCountryHolidaysByDateString(dateFormat(targetDate))
  },
  targetDateString({ targetDate }: State): string | undefined {
    if (!targetDate) return

    return dateFormat(targetDate)
  }
}

export const mutationType: { [key: string]: string } = {
  ON_UPDATE_SIGNEDIN_STATUS: 'ON_UPDATE_SIGNEDIN_STATUS',
  ON_DONE_CLIENT_INIT: 'ON_DONE_CLIENT_INIT',
  SET_HOLIDAYS: 'SET_HOLIDAYS',
  SET_TARGET_DATE: 'SET_TARGET_DATE',
  START_FETCHING: 'START_FETCHING',
  FINISH_FETCHING: 'FINISH_FETCHING'
}

export const mutations: MutationTree<State> = {
  [mutationType.ON_DONE_CLIENT_INIT](state: State): void {
    state.doneClientInit = true
  },
  [mutationType.SET_HOLIDAYS](
    state: State,
    {
      year,
      holidays,
      alpha2Code,
      language,
      summary
    }: {
      year: number
      holidays: HolidayData[]
      alpha2Code: string
      language: string
      summary: string
    }
  ): void {
    state.holidays.push({
      year,
      holidays,
      alpha2Code,
      language,
      summary
    })
  },
  [mutationType.SET_TARGET_DATE](state: State, targetDate: Date): void {
    state.targetDate = targetDate
  },
  [mutationType.START_FETCHING](state: State): void {
    state.isFetching = true
  },
  [mutationType.FINISH_FETCHING](state: State): void {
    state.isFetching = false
  }
}

export const actions: ActionTree<State, any> = {
  loadAndInit({ dispatch, commit }): Promise<void> {
    return new Promise(
      (resolve: () => void, reject: (reason: any) => void): void => {
        gapi.load('client', {
          async callback(): Promise<void> {
            await dispatch('init').catch((err: any): void => {
              throw new Error(err)
            })

            commit(mutationType.ON_DONE_CLIENT_INIT)

            resolve()
          },
          onerror(): void {
            reject(new Error('gapi.client failed to load'))
          }
        })
      }
    )
  },
  async init(): Promise<void> {
    await gapi.client.init({
      apiKey: process.env.GAPI_API_KEY,
      clientId: process.env.GAPI_CLIENT_KEY,
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
      ],
      scope: 'https://www.googleapis.com/auth/calendar.events.readonly'
    })
  },
  async fetchYearHolidaysByCalendarId(
    { commit, getters }: ActionContext<State, undefined>,
    {
      calendarId,
      year,
      alpha2Code,
      language
    }: {
      calendarId: string
      year: number
      alpha2Code: string
      language: string
    }
  ): Promise<void> {
    if (getters.hasHolidays({ alpha2Code, language, year })) {
      return
    }

    try {
      const res = await gapi.client.calendar.events.list({
        calendarId,
        timeMin: new Date(year, 0, 1).toISOString(),
        timeMax: new Date(year + 1, 0, 1).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
        alwaysIncludeEmail: false
      })

      console.log(res)

      commit(mutationType.SET_HOLIDAYS, {
        alpha2Code,
        year,
        language,
        summary: res.result.summary,
        holidays: (res.result.items as Resource[]).map(
          (holiday: Resource): HolidayData => ({
            start: holiday.start,
            end: holiday.end,
            summary: holiday.summary
          })
        ) as HolidayData[]
      })
    } catch (error) {
      console.log(calendarId, year)
      console.log(error)
    }
  },
  async fetchHolidays(
    { state, commit, dispatch }: ActionContext<State, undefined>,
    {
      year,
      selectedCountries,
      language
    }: { year: number; selectedCountries: Country[]; language: string }
  ): Promise<void> {
    commit(mutationType.START_FETCHING)

    if (!state.doneClientInit) {
      await dispatch('loadAndInit')
    }

    const request: Promise<void>[] = selectedCountries.map(
      (country: Country): Promise<void> => {
        return dispatch('fetchYearHolidaysByCalendarId', {
          year,
          alpha2Code: country.alpha2Code,
          language,
          calendarId: `${language.toLocaleLowerCase()}.${(country.googleCalendarId as string).toLocaleLowerCase()}#holiday@group.v.calendar.google.com`
        })
      }
    )

    Promise.all(request).then((result: any[]): void => {
      console.log(result)
    })

    commit(mutationType.FINISH_FETCHING)
  },
  setTargetDate(
    { commit }: ActionContext<State, undefined>,
    targetDate: Date
  ): void {
    commit(mutationType.SET_TARGET_DATE, targetDate)
  }
}
