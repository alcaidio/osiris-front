import { CalendarMockApi } from 'app/data/mock/apps/calendar'
import { ContactsMockApi } from 'app/data/mock/apps/contacts'
import { ECommerceInventoryMockApi } from 'app/data/mock/apps/ecommerce/inventory'
import { MailboxMockApi } from 'app/data/mock/apps/mailbox'
import { TasksMockApi } from 'app/data/mock/apps/tasks'
import { AuthMockApi } from 'app/data/mock/auth'
import { MessagesMockApi } from 'app/data/mock/common/messages'
import { NavigationMockApi } from 'app/data/mock/common/navigation'
import { NotificationsMockApi } from 'app/data/mock/common/notifications'
import { SearchMockApi } from 'app/data/mock/common/search'
import { ShortcutsMockApi } from 'app/data/mock/common/shortcuts'
import { UserMockApi } from 'app/data/mock/common/user'
import { AnalyticsMockApi } from 'app/data/mock/dashboards/analytics'
import { CryptoMockApi } from 'app/data/mock/dashboards/crypto'
import { FinanceMockApi } from 'app/data/mock/dashboards/finance'
import { HelpCenterMockApi } from 'app/data/mock/pages/help-center'
import { IconsMockApi } from 'app/data/mock/ui/icons'
import { DiagnosticMockApi } from './map/index'
import { MapListMockApi } from './maps/index'

export const mockDataServices = [
  AnalyticsMockApi,
  AuthMockApi,
  CalendarMockApi,
  ContactsMockApi,
  CryptoMockApi,
  ECommerceInventoryMockApi,
  FinanceMockApi,
  HelpCenterMockApi,
  IconsMockApi,
  MailboxMockApi,
  MessagesMockApi,
  NavigationMockApi,
  NotificationsMockApi,
  SearchMockApi,
  ShortcutsMockApi,
  TasksMockApi,
  UserMockApi,
  DiagnosticMockApi,
  MapListMockApi,
]
