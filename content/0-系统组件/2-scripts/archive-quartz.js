// archive-fixed.js - Quartz 4 归档脚本（修正版）
async function archiveToQuartz() {
    // ==================== 配置区 ====================
    const targetFolder = "CS";              
    const keepTags = true;                 // true保留原tags, false清空
    const dateFormat = "YYYY-MM-DDTHH:mm:ss";
    const desiredOrder = ['title', 'description', 'tags', 'aliases', 'date', 'publish'];
    
    // 字段类型控制
    const fieldTypes = {
        title: 'string', description: 'string', tags: 'array', 
        aliases: 'array', date: 'datetime', publish: 'boolean'
    };
    // ===============================================

    const files = app.vault.getMarkdownFiles().filter(f => f.path.startsWith(targetFolder + "/"));
    let processed = 0, usedExistingDate = 0;

    for (const file of files) {
        try {
            // 读取原始内容
            const content = await app.vault.read(file);
            
            // 解析frontmatter（兼容无frontmatter的情况）
            const fmRegex = /^---\n([\s\S]*?)\n---\n?/;
            const match = content.match(fmRegex);
            const body = match ? content.slice(match[0].length) : content;
            const yamlText = match ? match[1] : '';
            
            // 简单解析YAML为对象
            const fm = {};
            let currentKey = null;
            for (const line of yamlText.split('\n')) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) continue;
                
                if (trimmed.startsWith('- ')) {
                    if (!fm[currentKey]) fm[currentKey] = [];
                    fm[currentKey].push(trimmed.slice(2).trim());
                } else if (trimmed.includes(':')) {
                    const idx = trimmed.indexOf(':');
                    const key = trimmed.slice(0, idx).trim();
                    const val = trimmed.slice(idx + 1).trim();
                    currentKey = key;
                    
                    if (val === '') fm[key] = [];
                    else if (val === 'true') fm[key] = true;
                    else if (val === 'false') fm[key] = false;
                    else fm[key] = val.replace(/^["'](.*)["']$/, '$1');
                }
            }
            
            // 日期策略：有date用date，无date用文件创建时间
            let finalDate = fm.date;
            if (!finalDate || String(finalDate).trim() === "") {
                const stat = await app.vault.adapter.stat(file.path);
                finalDate = moment(stat.ctime).format(dateFormat);
            } else {
                usedExistingDate++;
            }
            
            // 构建新frontmatter
            const newFm = {
                title: fm.title || file.basename,
                description: fm.description || "",
                tags: (keepTags && Array.isArray(fm.tags)) ? fm.tags : [],
                aliases: Array.isArray(fm.aliases) ? fm.aliases : [],
                date: finalDate,
                publish: fm.publish !== false  // 默认true
            };
            
            // 生成YAML（带类型控制）
            const lines = ['---'];
            for (const key of desiredOrder) {
                const val = newFm[key];
                const type = fieldTypes[key];
                
                if (type === 'array') {
                    lines.push(`${key}:`);
                    if (val.length === 0) lines.push(`  []`);
                    else val.forEach(item => lines.push(`  - ${item}`));
                } else if (type === 'boolean') {
                    lines.push(`${key}: ${val}`);
                } else if (type === 'datetime') {
                    lines.push(`${key}: ${val}`);
                } else {
                    // string: 转义双引号
                    const escaped = String(val).replace(/"/g, '\\"');
                    lines.push(`${key}: "${escaped}"`);
                }
            }
            lines.push('---');
            
            // 关键：使用真实换行符 \n，不是 \\n
            const newContent = lines.join('\n') + '\n' + body;
            
            // 只有变化了才写入
            if (newContent !== content) {
                await app.vault.modify(file, newContent);
                processed++;
            }
            
        } catch (error) {
            console.error(`处理失败 ${file.path}:`, error);
        }
    }
    
    new Notice(`✅ 已处理 ${processed} 个文件 | 📅 ${usedExistingDate} 个保留原日期`, 5000);
}

archiveToQuartz();