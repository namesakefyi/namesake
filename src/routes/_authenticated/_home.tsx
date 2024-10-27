import {
  Badge,
  Button,
  Empty,
  GridList,
  GridListItem,
  Link,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  ProgressBar,
  Tooltip,
  TooltipTrigger,
} from '@/components'
import { api } from '@convex/_generated/api'
import { ICONS, type SortQuestsBy } from '@convex/constants'
import {
  RiAddLine,
  RiCheckLine,
  RiMoreFill,
  RiSignpostLine,
} from '@remixicon/react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Authenticated, Unauthenticated, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export const Route = createFileRoute('/_authenticated/_home')({
  component: IndexRoute,
})

function IndexRoute() {
  const [showCompleted, setShowCompleted] = useState(
    localStorage.getItem('showCompleted') === 'true',
  )
  const [sortBy, setSortBy] = useState<SortQuestsBy>(
    (localStorage.getItem('sortQuestsBy') as SortQuestsBy) ?? 'newest',
  )

  const toggleShowCompleted = () => {
    toast(
      showCompleted ? 'Hiding completed quests' : 'Showing completed quests',
    )
    setShowCompleted(!showCompleted)
  }

  useEffect(() => {
    localStorage.setItem('showCompleted', showCompleted.toString())
  }, [showCompleted])

  useEffect(() => {
    localStorage.setItem('sortQuestsBy', sortBy)
  }, [sortBy])

  const MyQuests = () => {
    const myQuests = useQuery(api.userQuests.getQuestsForCurrentUser)
    const completedQuests = useQuery(api.userQuests.getCompletedQuestCount)

    if (myQuests === undefined) return

    if (myQuests === null || myQuests.length === 0)
      return (
        <Empty
          title="No quests"
          icon={RiSignpostLine}
          link={{
            children: 'Add quest',
            button: {
              variant: 'primary',
            },
            href: { to: '/browse' },
          }}
        />
      )

    const totalQuests = myQuests.length

    const sortedQuests = myQuests.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a._creationTime - b._creationTime
        case 'newest':
          return b._creationTime - a._creationTime
        default:
          return 0
      }
    })

    const filteredQuests = sortedQuests.filter((quest) => {
      if (showCompleted) return true
      return !quest.completionTime
    })

    return (
      <div className="flex flex-col w-80 border-r border-gray-dim overflow-y-auto">
        <div className="flex items-center py-3 px-4 h-16 border-b border-gray-dim">
          <ProgressBar
            label="Quests complete"
            value={completedQuests}
            maxValue={totalQuests}
            valueLabel={`${completedQuests} of ${totalQuests}`}
            className="mr-4"
          />
          <TooltipTrigger>
            <MenuTrigger>
              <Button icon={RiMoreFill} variant="icon" />
              <Menu>
                <MenuItem
                  onAction={() => setSortBy('newest')}
                  isDisabled={sortBy === 'newest'}
                >
                  Sort by newest
                </MenuItem>
                <MenuItem
                  onAction={() => setSortBy('oldest')}
                  isDisabled={sortBy === 'oldest'}
                >
                  Sort by oldest
                </MenuItem>

                {typeof completedQuests === 'number' && completedQuests > 0 && (
                  <>
                    <MenuSeparator />
                    <MenuItem onAction={toggleShowCompleted}>
                      {showCompleted
                        ? `Hide ${completedQuests} completed ${completedQuests > 1 ? 'quests' : 'quest'}`
                        : `Show ${completedQuests} completed ${completedQuests > 1 ? 'quests' : 'quest'}`}
                    </MenuItem>
                  </>
                )}
              </Menu>
            </MenuTrigger>
            <Tooltip>Sort and filter</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <Link
              aria-label="Add quest"
              href={{ to: '/browse' }}
              button={{ variant: 'icon', className: '-mr-1' }}
            >
              <RiAddLine size={20} />
            </Link>
            <Tooltip>Add quests</Tooltip>
          </TooltipTrigger>
        </div>
        <GridList aria-label="My quests" className="border-none px-1 py-2">
          {filteredQuests.map((quest) => {
            if (quest === null) return null

            const Icon = ICONS[quest.icon]

            return (
              <GridListItem
                textValue={quest.title}
                key={quest._id}
                href={{
                  to: '/quests/$questId',
                  params: { questId: quest.questId },
                }}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div
                    className={twMerge(
                      'flex items-center gap-2',
                      quest.completionTime && 'opacity-40',
                    )}
                  >
                    <Icon size={20} className="text-gray-dim" />
                    <p>{quest.title}</p>
                    {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
                  </div>
                  {quest.completionTime ? (
                    <RiCheckLine
                      className="text-green-9 dark:text-green-dark-9 ml-auto"
                      size={20}
                    />
                  ) : null}
                </div>
              </GridListItem>
            )
          })}
          {!showCompleted && completedQuests && completedQuests > 0 && (
            <GridListItem
              textValue="Show completed"
              onAction={() => setShowCompleted(true)}
            >
              <div className="flex items-center justify-start gap-2 w-full text-gray-dim">
                <RiCheckLine size={20} />
                {`${completedQuests} completed ${completedQuests > 1 ? 'quests' : 'quest'} hidden`}
              </div>
            </GridListItem>
          )}
        </GridList>
      </div>
    )
  }

  return (
    <>
      <Authenticated>
        <div className="flex flex-1 min-h-0">
          <MyQuests />
          <Outlet />
        </div>
      </Authenticated>
      <Unauthenticated>
        <h1>Please log in</h1>
      </Unauthenticated>
    </>
  )
}
