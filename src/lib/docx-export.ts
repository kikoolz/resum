import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    convertInchesToTwip,
    type IParagraphOptions,
} from "docx";
import type { ResumeValues } from "@/lib/validation";

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    if (!year) return "";
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthIndex = month ? parseInt(month, 10) - 1 : -1;
    if (monthIndex >= 0 && monthIndex < 12) {
        return `${months[monthIndex]} ${year}`;
    }
    return year;
}

function dateRange(start?: string, end?: string): string {
    const s = formatDate(start);
    const e = end ? formatDate(end) : "Present";
    if (!s && !e) return "";
    if (!s) return e;
    return `${s} – ${e}`;
}

function heading(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                size: 20,
                font: "Arial",
                color: "333333",
            }),
        ],
        spacing: { before: 240, after: 80 },
        border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        },
    });
}

function bodyParagraph(text: string, options?: Partial<IParagraphOptions>): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                size: 20,
                font: "Arial",
                color: "333333",
            }),
        ],
        spacing: { after: 40 },
        ...options,
    });
}

function bulletItem(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                size: 20,
                font: "Arial",
                color: "333333",
            }),
        ],
        bullet: { level: 0 },
        spacing: { after: 20 },
    });
}

function nameLine(data: ResumeValues): string {
    const first = data.firstName || "";
    const last = data.lastName || "";
    return `${first} ${last}`.trim() || "Your Name";
}

function contactLine(data: ResumeValues): string {
    const parts: string[] = [];
    if (data.email) parts.push(data.email);
    if (data.phone) parts.push(data.phone);
    if (data.city || data.country) {
        parts.push([data.city, data.country].filter(Boolean).join(", "));
    }
    if (data.linkedin) parts.push(data.linkedin);
    if (data.website) parts.push(data.website);
    return parts.join(" | ");
}

function isVisible(
    key: string,
    sectionVisibility?: Record<string, boolean>,
): boolean {
    if (!sectionVisibility) return true;
    return sectionVisibility[key] !== false;
}

function isItemVisible(item: { visible?: boolean }): boolean {
    return item.visible !== false;
}

function sortByOrder<T extends { displayOrder?: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export async function generateDocx(data: ResumeValues): Promise<Buffer> {
    const sections: Paragraph[] = [];

    // --- Header: Name ---
    sections.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: nameLine(data),
                    bold: true,
                    size: 32,
                    font: "Arial",
                    color: "111111",
                }),
            ],
            spacing: { after: 40 },
            alignment: AlignmentType.CENTER,
        }),
    );

    // --- Header: Job Title ---
    if (data.jobTitle) {
        sections.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: data.jobTitle,
                        size: 22,
                        font: "Arial",
                        color: "555555",
                        italics: true,
                    }),
                ],
                spacing: { after: 40 },
                alignment: AlignmentType.CENTER,
            }),
        );
    }

    // --- Header: Contact ---
    const contact = contactLine(data);
    if (contact) {
        sections.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: contact,
                        size: 18,
                        font: "Arial",
                        color: "666666",
                    }),
                ],
                spacing: { after: 120 },
                alignment: AlignmentType.CENTER,
            }),
        );
    }

    // --- Determine section order ---
    const defaultOrder = [
        "profile",
        "experience",
        "education",
        "skills",
        "projects",
        "awards",
        "publications",
        "certificates",
        "languages",
        "courses",
        "references",
        "interests",
    ];
    const sectionOrder = data.sectionOrder?.length
        ? data.sectionOrder.filter((s) => s !== "personal-info")
        : defaultOrder;

    for (const sectionKey of sectionOrder) {
        if (!isVisible(sectionKey, data.sectionVisibility)) continue;

        switch (sectionKey) {
            case "profile": {
                if (!data.summary) break;
                sections.push(heading("Profile"));
                sections.push(bodyParagraph(stripHtml(data.summary)));
                break;
            }

            case "experience": {
                const items = sortByOrder(
                    (data.workExperiences || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("Experience"));
                for (const exp of items) {
                    const title = [exp.position, exp.company]
                        .filter(Boolean)
                        .join(" at ");
                    if (title) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: title,
                                        bold: true,
                                        size: 20,
                                        font: "Arial",
                                        color: "222222",
                                    }),
                                    new TextRun({
                                        text: `    ${dateRange(exp.startDate, exp.endDate)}`,
                                        size: 18,
                                        font: "Arial",
                                        color: "888888",
                                        italics: true,
                                    }),
                                ],
                                spacing: { before: 120, after: 20 },
                            }),
                        );
                    }
                    if (exp.location) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: exp.location,
                                        size: 18,
                                        font: "Arial",
                                        color: "888888",
                                    }),
                                ],
                                spacing: { after: 20 },
                            }),
                        );
                    }
                    if (exp.description) {
                        const desc = stripHtml(exp.description);
                        desc.split("\n").forEach((line) => {
                            const trimmed = line.trim();
                            if (trimmed) sections.push(bulletItem(trimmed));
                        });
                    }
                }
                break;
            }

            case "education": {
                const items = sortByOrder(
                    (data.educations || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("Education"));
                for (const edu of items) {
                    const degree = [edu.degree, edu.fieldOfStudy]
                        .filter(Boolean)
                        .join(" in ");
                    const title = [degree, edu.school].filter(Boolean).join(" – ");
                    if (title) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: title,
                                        bold: true,
                                        size: 20,
                                        font: "Arial",
                                        color: "222222",
                                    }),
                                    new TextRun({
                                        text: `    ${dateRange(edu.startDate, edu.endDate)}`,
                                        size: 18,
                                        font: "Arial",
                                        color: "888888",
                                        italics: true,
                                    }),
                                ],
                                spacing: { before: 120, after: 20 },
                            }),
                        );
                    }
                    if (edu.gpa) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `GPA: ${edu.gpa}`,
                                        size: 18,
                                        font: "Arial",
                                        color: "666666",
                                    }),
                                ],
                                spacing: { after: 20 },
                            }),
                        );
                    }
                    if (edu.description) {
                        const desc = stripHtml(edu.description);
                        desc.split("\n").forEach((line) => {
                            const trimmed = line.trim();
                            if (trimmed) sections.push(bulletItem(trimmed));
                        });
                    }
                }
                break;
            }

            case "skills": {
                if (!data.skills?.length) break;
                sections.push(heading("Skills"));
                sections.push(
                    bodyParagraph(data.skills.join(" · ")),
                );
                break;
            }

            case "projects": {
                const items = sortByOrder(
                    (data.projects || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("Projects"));
                for (const proj of items) {
                    const dateStr = dateRange(proj.startDate, proj.endDate);
                    if (proj.title) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: proj.title,
                                        bold: true,
                                        size: 20,
                                        font: "Arial",
                                        color: "222222",
                                    }),
                                    ...(dateStr
                                        ? [
                                              new TextRun({
                                                  text: `    ${dateStr}`,
                                                  size: 18,
                                                  font: "Arial",
                                                  color: "888888",
                                                  italics: true,
                                              }),
                                          ]
                                        : []),
                                ],
                                spacing: { before: 120, after: 20 },
                            }),
                        );
                    }
                    if (proj.subtitle) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: proj.subtitle,
                                        size: 18,
                                        font: "Arial",
                                        color: "666666",
                                    }),
                                ],
                                spacing: { after: 20 },
                            }),
                        );
                    }
                    if (proj.description) {
                        const desc = stripHtml(proj.description);
                        desc.split("\n").forEach((line) => {
                            const trimmed = line.trim();
                            if (trimmed) sections.push(bulletItem(trimmed));
                        });
                    }
                    if (proj.link) {
                        sections.push(
                            bodyParagraph(proj.link),
                        );
                    }
                }
                break;
            }

            case "awards": {
                const items = sortByOrder(
                    (data.awards || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("Awards"));
                for (const award of items) {
                    const title = [award.title, award.issuer]
                        .filter(Boolean)
                        .join(" – ");
                    if (title) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: title,
                                        bold: true,
                                        size: 20,
                                        font: "Arial",
                                        color: "222222",
                                    }),
                                    ...(award.date
                                        ? [
                                              new TextRun({
                                                  text: `    ${formatDate(award.date)}`,
                                                  size: 18,
                                                  font: "Arial",
                                                  color: "888888",
                                                  italics: true,
                                              }),
                                          ]
                                        : []),
                                ],
                                spacing: { before: 120, after: 20 },
                            }),
                        );
                    }
                    if (award.description) {
                        sections.push(bodyParagraph(stripHtml(award.description)));
                    }
                }
                break;
            }

            case "publications": {
                const items = sortByOrder(
                    (data.publications || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("Publications"));
                for (const pub of items) {
                    const title = [pub.title, pub.publisher]
                        .filter(Boolean)
                        .join(" – ");
                    if (title) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: title,
                                        bold: true,
                                        size: 20,
                                        font: "Arial",
                                        color: "222222",
                                    }),
                                    ...(pub.date
                                        ? [
                                              new TextRun({
                                                  text: `    ${formatDate(pub.date)}`,
                                                  size: 18,
                                                  font: "Arial",
                                                  color: "888888",
                                                  italics: true,
                                              }),
                                          ]
                                        : []),
                                ],
                                spacing: { before: 120, after: 20 },
                            }),
                        );
                    }
                    if (pub.authors) {
                        sections.push(
                            bodyParagraph(`Authors: ${pub.authors}`),
                        );
                    }
                    if (pub.description) {
                        sections.push(bodyParagraph(stripHtml(pub.description)));
                    }
                }
                break;
            }

            case "certificates": {
                const items = sortByOrder(
                    (data.certificates || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("Certificates"));
                for (const cert of items) {
                    const title = [cert.title, cert.issuer]
                        .filter(Boolean)
                        .join(" – ");
                    if (title) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: title,
                                        bold: true,
                                        size: 20,
                                        font: "Arial",
                                        color: "222222",
                                    }),
                                    ...(cert.date
                                        ? [
                                              new TextRun({
                                                  text: `    ${formatDate(cert.date)}`,
                                                  size: 18,
                                                  font: "Arial",
                                                  color: "888888",
                                                  italics: true,
                                              }),
                                          ]
                                        : []),
                                ],
                                spacing: { before: 120, after: 20 },
                            }),
                        );
                    }
                    if (cert.credentialId) {
                        sections.push(
                            bodyParagraph(`Credential ID: ${cert.credentialId}`),
                        );
                    }
                    if (cert.description) {
                        sections.push(bodyParagraph(stripHtml(cert.description)));
                    }
                }
                break;
            }

            case "languages": {
                const items = sortByOrder(
                    (data.languages || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("Languages"));
                for (const lang of items) {
                    const text = lang.proficiency
                        ? `${lang.language} – ${lang.proficiency}`
                        : lang.language || "";
                    if (text) sections.push(bulletItem(text));
                }
                break;
            }

            case "courses": {
                const items = sortByOrder(
                    (data.courses || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("Courses"));
                for (const course of items) {
                    const title = [course.name, course.institution]
                        .filter(Boolean)
                        .join(" – ");
                    if (title) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: title,
                                        bold: true,
                                        size: 20,
                                        font: "Arial",
                                        color: "222222",
                                    }),
                                    ...(course.date
                                        ? [
                                              new TextRun({
                                                  text: `    ${formatDate(course.date)}`,
                                                  size: 18,
                                                  font: "Arial",
                                                  color: "888888",
                                                  italics: true,
                                              }),
                                          ]
                                        : []),
                                ],
                                spacing: { before: 120, after: 20 },
                            }),
                        );
                    }
                    if (course.description) {
                        sections.push(bodyParagraph(stripHtml(course.description)));
                    }
                }
                break;
            }

            case "references": {
                const items = sortByOrder(
                    (data.references || []).filter(isItemVisible),
                );
                if (!items.length) break;
                sections.push(heading("References"));
                for (const ref of items) {
                    const name = ref.name || "";
                    const title = [ref.position, ref.company]
                        .filter(Boolean)
                        .join(" at ");
                    if (name) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: name,
                                        bold: true,
                                        size: 20,
                                        font: "Arial",
                                        color: "222222",
                                    }),
                                ],
                                spacing: { before: 80, after: 20 },
                            }),
                        );
                    }
                    if (title) sections.push(bodyParagraph(title));
                    const contactParts: string[] = [];
                    if (ref.email) contactParts.push(ref.email);
                    if (ref.phone) contactParts.push(ref.phone);
                    if (contactParts.length) {
                        sections.push(bodyParagraph(contactParts.join(" | ")));
                    }
                }
                break;
            }

            case "interests": {
                const items = (data.interests || []).filter(isItemVisible);
                if (!items.length) break;
                sections.push(heading("Interests"));
                sections.push(
                    bodyParagraph(
                        items.map((i) => i.name || "").filter(Boolean).join(" · "),
                    ),
                );
                break;
            }
        }
    }

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: convertInchesToTwip(0.75),
                            bottom: convertInchesToTwip(0.75),
                            left: convertInchesToTwip(0.75),
                            right: convertInchesToTwip(0.75),
                        },
                    },
                },
                children: sections,
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    return Buffer.from(buffer);
}
