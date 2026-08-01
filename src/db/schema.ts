import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import * as authSchema from "./auth.schema";

// ---------------------------------------------------------------------------
// Resumes
// ---------------------------------------------------------------------------
export const resumes = sqliteTable("resumes", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),

    title: text("title"),
    description: text("description"),

    photoUrl: text("photo_url"),
    colorHex: text("color_hex").notNull().default("#000000"),
    borderStyle: text("border_style").notNull().default("squircle"),
    layout: text("layout").notNull().default("single-column"), // "single-column" | "two-column" | "split-date"
    templateName: text("template_name").notNull().default("professional"), // "professional" | "creative" | "modern" | "simple"
    summary: text("summary"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    jobTitle: text("job_title"),
    city: text("city"),
    country: text("country"),
    phone: text("phone"),
    email: text("email"),

    // New personal-info fields
    linkedin: text("linkedin"),
    website: text("website"),

    // SQLite has no array type — store as JSON string
    skills: text("skills", { mode: "json" }).$type<string[]>().default([]),

    // Preview settings
    fontSize: integer("font_size").notNull().default(10),
    fontFamily: text("font_family").notNull().default("serif"),

    // Editor config — section ordering & visibility persisted as JSON
    sectionOrder: text("section_order", { mode: "json" })
        .$type<string[]>()
        .default([
            "personal-info",
            "profile",
            "education",
            "skills",
            "experience",
            "projects",
            "awards",
            "publications",
            "certificates",
        ]),
    sectionVisibility: text("section_visibility", { mode: "json" })
        .$type<Record<string, boolean>>()
        .default({}),
    fieldVisibility: text("field_visibility", { mode: "json" })
        .$type<Record<string, boolean>>()
        .default({}),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
}, (t) => [
    index("resumes_user_id_idx").on(t.userId),
]);

export const resumesRelations = relations(resumes, ({ many }) => ({
    workExperiences: many(workExperiences),
    educations: many(educations),
    projects: many(projects),
    awards: many(awards),
    publications: many(publications),
    certificates: many(certificates),
    languages: many(languages),
    courses: many(courses),
    resumeReferences: many(resumeReferences),
    interests: many(interests),
    coverLetters: many(coverLetters),
}));

// ---------------------------------------------------------------------------
// Work Experiences
// ---------------------------------------------------------------------------
export const workExperiences = sqliteTable("work_experiences", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    position: text("position"),
    company: text("company"),
    startDate: integer("start_date", { mode: "timestamp" }),
    endDate: integer("end_date", { mode: "timestamp" }),
    description: text("description"),
    location: text("location"),
    subheading: text("subheading"),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const workExperiencesRelations = relations(
    workExperiences,
    ({ one }) => ({
        resume: one(resumes, {
            fields: [workExperiences.resumeId],
            references: [resumes.id],
        }),
    }),
);

// ---------------------------------------------------------------------------
// Educations
// ---------------------------------------------------------------------------
export const educations = sqliteTable("educations", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    degree: text("degree"),
    school: text("school"),
    fieldOfStudy: text("field_of_study"),
    gpa: text("gpa"),
    description: text("description"),
    location: text("location"),
    startDate: integer("start_date", { mode: "timestamp" }),
    endDate: integer("end_date", { mode: "timestamp" }),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const educationsRelations = relations(educations, ({ one }) => ({
    resume: one(resumes, {
        fields: [educations.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const projects = sqliteTable("projects", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    title: text("title"),
    subtitle: text("subtitle"),
    description: text("description"),
    link: text("link"),
    startDate: integer("start_date", { mode: "timestamp" }),
    endDate: integer("end_date", { mode: "timestamp" }),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const projectsRelations = relations(projects, ({ one }) => ({
    resume: one(resumes, {
        fields: [projects.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------
export const awards = sqliteTable("awards", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    title: text("title"),
    issuer: text("issuer"),
    description: text("description"),
    date: integer("date", { mode: "timestamp" }),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const awardsRelations = relations(awards, ({ one }) => ({
    resume: one(resumes, {
        fields: [awards.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------
export const publications = sqliteTable("publications", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    title: text("title"),
    publisher: text("publisher"),
    authors: text("authors"),
    description: text("description"),
    date: integer("date", { mode: "timestamp" }),
    link: text("link"),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const publicationsRelations = relations(publications, ({ one }) => ({
    resume: one(resumes, {
        fields: [publications.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------
export const certificates = sqliteTable("certificates", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    title: text("title"),
    issuer: text("issuer"),
    description: text("description"),
    date: integer("date", { mode: "timestamp" }),
    link: text("link"),
    credentialId: text("credential_id"),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const certificatesRelations = relations(certificates, ({ one }) => ({
    resume: one(resumes, {
        fields: [certificates.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// Languages (optional section)
// ---------------------------------------------------------------------------
export const languages = sqliteTable("languages", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    language: text("language"),
    proficiency: text("proficiency"),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const languagesRelations = relations(languages, ({ one }) => ({
    resume: one(resumes, {
        fields: [languages.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// Courses (optional section)
// ---------------------------------------------------------------------------
export const courses = sqliteTable("courses", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    name: text("name"),
    institution: text("institution"),
    description: text("description"),
    date: integer("date", { mode: "timestamp" }),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const coursesRelations = relations(courses, ({ one }) => ({
    resume: one(resumes, {
        fields: [courses.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// References (optional section)
// ---------------------------------------------------------------------------
export const resumeReferences = sqliteTable("resume_references", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    name: text("name"),
    position: text("position"),
    company: text("company"),
    email: text("email"),
    phone: text("phone"),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const resumeReferencesRelations = relations(
    resumeReferences,
    ({ one }) => ({
        resume: one(resumes, {
            fields: [resumeReferences.resumeId],
            references: [resumes.id],
        }),
    }),
);

// ---------------------------------------------------------------------------
// Interests (optional section)
// ---------------------------------------------------------------------------
export const interests = sqliteTable("interests", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    name: text("name"),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),

    resumeId: text("resume_id")
        .notNull()
        .references(() => resumes.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const interestsRelations = relations(interests, ({ one }) => ({
    resume: one(resumes, {
        fields: [interests.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// Cover Letters
// ---------------------------------------------------------------------------
export const coverLetters = sqliteTable("cover_letters", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    resumeId: text("resume_id").references(() => resumes.id, {
        onDelete: "set null",
    }),

    title: text("title"),
    companyName: text("company_name"),
    jobTitle: text("job_title"),
    jobDescription: text("job_description"),
    tone: text("tone").notNull().default("professional"), // "professional" | "casual" | "enthusiastic" | "formal"
    content: text("content"), // generated cover letter HTML/text

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
}, (t) => [
    index("cover_letters_user_id_idx").on(t.userId),
]);

export const coverLettersRelations = relations(coverLetters, ({ one }) => ({
    resume: one(resumes, {
        fields: [coverLetters.resumeId],
        references: [resumes.id],
    }),
}));

// ---------------------------------------------------------------------------
// User Subscriptions
// ---------------------------------------------------------------------------
export const userSubscriptions = sqliteTable("user_subscriptions", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    stripeCurrentPeriodEnd: integer("stripe_current_period_end", {
        mode: "timestamp",
    }).notNull(),
    stripeCancelAtPeriodEnd: integer("stripe_cancel_at_period_end", {
        mode: "boolean",
    })
        .notNull()
        .default(false),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// User Files (R2)
// ---------------------------------------------------------------------------
export const userFiles = sqliteTable("user_files", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    resumeId: text("resume_id").references(() => resumes.id, {
        onDelete: "set null",
    }),
    fileType: text("file_type").notNull(), // "photo" | "resume_pdf"
    r2Key: text("r2_key").notNull().unique(),
    fileName: text("file_name").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: text("mime_type").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

export const userFilesRelations = relations(userFiles, ({ one, many }) => ({
    resume: one(resumes, {
        fields: [userFiles.resumeId],
        references: [resumes.id],
    }),
    aiResults: many(aiResults),
}));

// ---------------------------------------------------------------------------
// AI Results Cache (extraction + analysis)
// ---------------------------------------------------------------------------
export const aiResults = sqliteTable("ai_results", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    userFileId: text("user_file_id")
        .notNull()
        .references(() => userFiles.id, { onDelete: "cascade" }),
    resultType: text("result_type").notNull(), // "extraction" | "analysis"
    resultData: text("result_data", { mode: "json" }).notNull(),
    modelId: text("model_id"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

export const aiResultsRelations = relations(aiResults, ({ one }) => ({
    userFile: one(userFiles, {
        fields: [aiResults.userFileId],
        references: [userFiles.id],
    }),
}));

// ---------------------------------------------------------------------------
// AI Usage Logs (token tracking per user)
// ---------------------------------------------------------------------------
export const aiUsageLogs = sqliteTable("ai_usage_logs", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    featureType: text("feature_type").notNull(), // "enhance" | "recreate" | "analyze" | "portfolio"
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    totalTokens: integer("total_tokens").notNull().default(0),
    modelId: text("model_id"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

// ---------------------------------------------------------------------------
// Referrals
// ---------------------------------------------------------------------------
export const referrals = sqliteTable(
    "referrals",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        referrerUserId: text("referrer_user_id").notNull(),
        referredUserId: text("referred_user_id").notNull().unique(),
        referralCode: text("referral_code").notNull(),
        rewardGranted: integer("reward_granted", { mode: "boolean" })
            .notNull()
            .default(false),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => [
        index("referrals_referrer_user_id_idx").on(table.referrerUserId),
        index("referrals_referral_code_idx").on(table.referralCode),
    ],
);

export const referralsRelations = relations(referrals, ({ one }) => ({
    referrer: one(authSchema.users, {
        fields: [referrals.referrerUserId],
        references: [authSchema.users.id],
        relationName: "referrer",
    }),
    referred: one(authSchema.users, {
        fields: [referrals.referredUserId],
        references: [authSchema.users.id],
        relationName: "referred",
    }),
}));

// ---------------------------------------------------------------------------
// Combine all schemas here for migrations
// ---------------------------------------------------------------------------
export const schema = {
    ...authSchema,
    resumes,
    resumesRelations,
    workExperiences,
    workExperiencesRelations,
    educations,
    educationsRelations,
    projects,
    projectsRelations,
    awards,
    awardsRelations,
    publications,
    publicationsRelations,
    certificates,
    certificatesRelations,
    languages,
    languagesRelations,
    courses,
    coursesRelations,
    resumeReferences,
    resumeReferencesRelations,
    interests,
    interestsRelations,
    coverLetters,
    coverLettersRelations,
    userSubscriptions,
    userFiles,
    userFilesRelations,
    aiResults,
    aiResultsRelations,
    aiUsageLogs,
    referrals,
    referralsRelations,
} as const;
