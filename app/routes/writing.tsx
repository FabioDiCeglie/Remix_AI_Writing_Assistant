import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { requireUserId } from "~/session.server";
import {
  ActionFunction,
  json,
  LoaderFunction,
} from "@remix-run/server-runtime";
import { getUserById, UpdateToken } from "~/models/user.server";
import {
  addCompletion,
  getMostRecentCompletion,
} from "~/models/completions.server";
import { Completion } from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const currentUser = await getUserById(userId);
  const recentCompletion = await getMostRecentCompletion(String(userId));

  return json({ recentCompletion, currentUser });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const currentUser = await getUserById(userId);

  const requestBody = await request.formData();
  const body = Object.fromEntries(requestBody);

  //check the user has enough tokens
  const errors = {
    tokens:
      currentUser && Number(body.tokens) > currentUser?.tokens
        ? "Not enough tokens"
        : undefined,
  };

  //if not enough return an error
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  try {
    // make the request to OPENAI  API
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-002",
        prompt: body.prompt,
        max_tokens: Number(body.tokens),
        temperature: 0.9,
        top_p: 1,
        frequency_penalty: 0.52,
        presence_penalty: 0.9,
        n: 1,
        best_of: 2,
        stream: false,
        logprobs: null,
      }),
    });
    console.log(response);
    const data = await response.json();
    const completionsText = data.choices[0].text;

    // Save the completion to the database
    const addedCompletion = await addCompletion({
      aiCompletion: completionsText,
      userId,
      prompt: String(body.prompt),
      token: Number(body.tokens),
    });

    // Update the user tokens if req succesful
    const updatedTokens = await UpdateToken(
      userId,
      Number(currentUser && currentUser?.tokens - Number(body?.tokens))
    );

    return json({ errors: undefined, addedCompletion });
  } catch (error: any) {
    console.error(error);
    // if not successful, return error
    return json({ errors: error.message });
  }
};

export default function Writing() {
  const errors = useActionData();
  const loaderData = useLoaderData();
  const { currentUser: user, recentCompletion } = loaderData;
  const transition = useTransition();

  return (
    <div className="text-slate-100">
      <div className="mx-auto mt-4 flex w-full items-center justify-between text-slate-200">
        <p>Welcome {user.email}</p>
        <div className="flex gap-5">
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Log out
            </button>
          </Form>
        </div>
      </div>
      <h1 className="text-2xl font-bold">AI writing tool</h1>

      <Form method="post">
        <fieldset
          className="mt-4 w-full"
          disabled={transition.state === "submitting"}
        >
          <textarea
            name="prompt"
            id="prompt"
            rows={5}
            className="w-full rounded-sm bg-slate-800 p-4 text-slate-200 disabled:bg-slate-800 disabled:text-slate-400"
          ></textarea>
          {errors && <p className="text-sm text-red-700">{errors.tokens}</p>}

          <div className="mt-4 flex items-center">
            <input
              type="number"
              name="tokens"
              id="tokens"
              defaultValue={150}
              className="w-24 rounded-sm bg-slate-800 p-4 text-slate-200 disabled:bg-slate-900"
            />
            <button
              type="submit"
              className="ml-4 rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600 disabled:bg-slate-800 disabled:hover:bg-slate-800"
            >
              {" "}
              Submit
            </button>
            <div className="ml-4">
              You have {user.tokens.toLocaleString()} tokens remaining
            </div>
          </div>
        </fieldset>
      </Form>

      {transition.state && transition.state === "submitting" && (
        <div className="my-8 flex justify-center">
          <div className="loader">Loading...</div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-indigo-500">
          Recent completions
        </h2>
        {recentCompletion &&
          recentCompletion.map((completion: Completion) => {
            let text: any = completion.answer;
            if (text.includes("\n")) {
              text = text.split("\n");
            }

            text = [...text];
            return (
              <div key={completion.id} className="mt-8">
                <h3 className="font-mono text-xl font-semibold text-white">
                  {completion.prompt}
                </h3>
                <div>
                  {text &&
                    text.map((line: string) => (
                      <p
                        key={`${line}-${Math.random()
                          .toString(36)
                          .slice(2, 7)}`}
                        className="mt-2"
                      >
                        {line}
                      </p>
                    ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
