import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'templates');
    const files = fs.readdirSync(templatesDir);

    const templates = files
      .filter((file) => file.toLowerCase().endsWith('.png'))
      .map((file) => ({
        id: path.parse(file).name,
        name: path
          .parse(file)
          .name.split('-')
          .join(' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        path: `/templates/${file}`,
      }));

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error reading templates:', error);
    return NextResponse.json(
      { error: 'Failed to load templates' },
      { status: 500 },
    );
  }
}
