FROM python:3.7 AS base
FROM base as build

RUN apt-get update &&  \
    apt-get install -y \
      postgresql       \
      libpq-dev

ADD ew_common /ew_common

RUN mkdir /install
ADD pollaris/Pipfile /install/Pipfile
ADD pollaris/Pipfile.lock /install/Pipfile.lock

WORKDIR /install

RUN pip install --upgrade pip                 \
    && python -m venv venv                    \
    && pip install pipenv                     \
    && pipenv lock -r -d > ./requirements.txt \
    && pipenv lock -r  >> ./requirements.txt  \
    && venv/bin/pip install -r requirements.txt

FROM base
COPY --from=build /install/venv /app/venv

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
      | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

RUN apt-get update &&     \
    apt-get install -y    \
      apt-transport-https \
      ca-certificates     \
      gnupg               \
      google-cloud-sdk

ADD ew_common /ew_common

ENV PATH="/app/venv/bin:$PATH"

ADD pollaris /app/
WORKDIR /app/

CMD [ "bash" ]
