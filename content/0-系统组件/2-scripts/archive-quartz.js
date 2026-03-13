// archive-v2.js - 优先使用 cdate 作为备选
async function archiveToQuartz() {
    const targetFolder = "CS/2-内容";              
    const keepTags = false;                 
    const dateFormat = "YYYY-MM-DDTHH:mm:ss";
    const desiredOrder = ['title', 'description', 'tags', 'aliases', 'date', 'publish'];
    const fieldTypes = {
        title: 'string', description: 'string', tags: 'array', 
        aliases: 'array', date: 'datetime', publish: 'boolean'
    };

    const files = app.vault.getMarkdownFiles().filter(f => f.path.startsWith(targetFolder + "/"));
    let processed = 0, usedExisting = 0, usedCdate = 0, usedSystem = 0;

    for (const file of files) {
        try {
            const content = await app.vault.read(file);
            
            // 解析 frontmatter
            const fmRegex = /^---\n([\s\S]*?)\n---\n?/;
            const match = content.match(fmRegex);
            const body = match ? content.slice(match[0].length) : content;
            const yamlText = match ? match[1] : '';
            
            // 简单解析
            const fm = {};
            let currentKey = null;
            for (const line of yamlText.split('\n')) {
                const t = line.trim();
                if (!t || t.startsWith('#')) continue;
                if (t.startsWith('- ')) {
                    if (!fm[currentKey]) fm[currentKey] = [];
                    fm[currentKey].push(t.slice(2).trim());
                } else if (t.includes(':')) {
                    const i = t.indexOf(':');
                    const k = t.slice(0, i).trim(), v = t.slice(i+1).trim();
                    currentKey = k;
                    if (v === '') fm[k] = [];
                    else if (v === 'true') fm[k] = true;
                    else if (v === 'false') fm[k] = false;
                    else fm[k] = v.replace(/^["'](.*)["']$/, '$1');
                }
            }
            
            // ========== 日期策略：date > cdate > 系统时间 ==========
            let finalDate = fm.date;
            let source = 'date';
            
            if (!finalDate || String(finalDate).trim() === "") {
                // 第二优先：cdate（已有的创建日期字段）
                if (fm.cdate && String(fm.cdate).trim() !== "") {
                    finalDate = fm.cdate;
                    source = 'cdate';
                } 
                // 最后才用系统时间
                else {
                    const stat = await app.vault.adapter.stat(file.path);
                    finalDate = moment(stat.ctime).format(dateFormat);
                    source = 'system';
                }
            }
            
            // 统计
            if (source === 'date') usedExisting++;
            else if (source === 'cdate') usedCdate++;
            else usedSystem++;
            // =====================================================
            
            const newFm = {
                title: fm.title || file.basename,
                description: fm.description || "",
                tags: (keepTags && Array.isArray(fm.tags)) ? fm.tags : [],
                aliases: Array.isArray(fm.aliases) ? fm.aliases : [],
                date: finalDate,
                publish: fm.publish !== false
            };
            
            // 生成 YAML
            const lines = ['---'];
            for (const key of desiredOrder) {
                const val = newFm[key], type = fieldTypes[key];
                if (type === 'array') {
                    lines.push(`${key}:`);
                    if (val.length === 0) lines.push(`  []`);
                    else val.forEach(i => lines.push(`  - ${i}`));
                } else if (type === 'boolean' || type === 'datetime') {
                    lines.push(`${key}: ${val}`);
                } else {
                    lines.push(`${key}: "${String(val).replace(/"/g, '\\"')}"`);
                }
            }
            lines.push('---');
            
            const newContent = lines.join('\n') + '\n' + body;
            if (newContent !== content) {
                await app.vault.modify(file, newContent);
                processed++;
            }
            
        } catch (e) {
            console.error(`❌ ${file.path}:`, e);
        }
    }
    
    new Notice(`✅ ${processed} 个已处理 | 📅 原date:${usedExisting} cdate:${usedCdate} 系统:${usedSystem}`, 6000);
}

archiveToQuartz();