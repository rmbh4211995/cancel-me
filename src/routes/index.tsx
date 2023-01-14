import type { JSX } from 'solid-js'
import { createSignal } from 'solid-js'
import { Title } from 'solid-start'
import type { Tweet } from '~/components/TweetList'
import { TweetList } from '~/components/TweetList'

interface TweetsResponse {
  results: Tweet[]
  error?: string
}

const fetchTweets = async (username: string) => {
  const resp = (await (await fetch(`/api/user/${username}/tweets`)).json()) as TweetsResponse

  return resp.results
}

export default function Index() {
  const [tweets, setTweets] = createSignal<Tweet[]>()

  const onSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (e) => {
    e.preventDefault()

    const form = document.getElementById('username-search-form') as HTMLFormElement | null
    if (!form) return

    const formData = Object.fromEntries(new FormData(form).entries())
    const username = formData['username'] as string
    if (!username) return

    const result = await fetchTweets(username)
    console.log(result)
    setTweets(result)
  }

  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/oauth/login`)).json()

    window.open(resp.authUrl, '_blank')
  }

  const onGetMyTweets: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch('/api/current-user/tweets')).json()

    setTweets(resp.data)
  }

  return (
    <main>
      <Title>Cancel Me</Title>
      <div class='mt-20 rounded border border-solid border-blue-200 p-4'>
        <h1 class='mb-6 text-5xl'>Welcome</h1>
        <p class='mb-4 text-3xl'>It's time to cancel yourself!</p>
        <p class='mb-4 text-lg'>
          Enter your Twitter username below to view every stupid thing you've blasted out to The
          Internet
        </p>
        <button
          onClick={onClick}
          class='mb-4 rounded border border-blue-200 py-1 px-2 text-slate-800'
        >
          Login with twitter
        </button>
        <button onClick={onGetMyTweets} class='border border-blue-200'>
          Get my tweets
        </button>
        <form onSubmit={onSubmit} id='username-search-form'>
          <div class='inline-flex rounded border border-solid border-blue-200'>
            <input
              type='text'
              id='username-field'
              name='username'
              class='rounded py-1 px-3'
              placeholder='__rmbh'
            />
            <button type='submit' class='w-20 bg-blue-200 text-slate-800'>
              Search
            </button>
          </div>
        </form>
      </div>
      {tweets() ? (
        <TweetList tweets={tweets()} />
      ) : (
        <div>Login or search a name to see your cringy posts</div>
      )}
    </main>
  )
}
