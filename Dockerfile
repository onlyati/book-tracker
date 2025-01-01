FROM node:20-alpine

ENV NODE_ENV=production
ENV APP_TITLE="Book Tracker"
ENV HOST_ADDRESS="http://0.0.0.0:3000"
ENV DATABASE_URL="file:./db/prod.db"
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /application
COPY package*.json ./
RUN npm install --dev
COPY . .
RUN mkdir -p /application/db
RUN npx prisma generate
RUN npm run build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /application
USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx next start"]
